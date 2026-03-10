CREATE OR REPLACE FUNCTION public.handle_product_staging(p_upload_id text)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_products_upserted INTEGER := 0;
BEGIN
  INSERT INTO "Brand" (id, name, slug, "isActive", "createdAt", "updatedAt")
  SELECT
    gen_random_uuid(),
    s.brand,
    lower(regexp_replace(s.brand, '[^a-zA-Z0-9]+', '-', 'g')),
    true,
    now(),
    now()
  FROM "ProductStaging" s
  WHERE s."uploadId" = p_upload_id
    AND s.brand IS NOT NULL
    AND btrim(s.brand) <> ''
  GROUP BY s.brand
  ON CONFLICT (name) DO NOTHING;

  INSERT INTO "Category" (id, name, slug, "isActive")
  SELECT
    gen_random_uuid(),
    s.category,
    lower(regexp_replace(s.category, '[^a-zA-Z0-9]+', '-', 'g')),
    true
  FROM "ProductStaging" s
  WHERE s."uploadId" = p_upload_id
    AND s.category IS NOT NULL
    AND btrim(s.category) <> ''
  GROUP BY s.category
  ON CONFLICT (name) DO NOTHING;

  INSERT INTO "Supplier" (id, name, slug, "isActive", "createdAt", "updatedAt")
  SELECT
    gen_random_uuid(),
    s.supplier,
    lower(regexp_replace(s.supplier, '[^a-zA-Z0-9]+', '-', 'g')),
    true,
    now(),
    now()
  FROM "ProductStaging" s
  WHERE s."uploadId" = p_upload_id
    AND s.supplier IS NOT NULL
    AND btrim(s.supplier) <> ''
  GROUP BY s.supplier
  ON CONFLICT (name) DO NOTHING;

  WITH dedup AS (
  SELECT DISTINCT ON (s.sku)
    s.*
  FROM "ProductStaging" s
  WHERE s."uploadId" = p_upload_id
    AND s.sku IS NOT NULL
  ORDER BY s.sku, s.id DESC  -- pick “latest” row per sku (or change ordering)
),
upserted AS (
  INSERT INTO "Product" (
    id,
    sku,
    description,
    available,
    margin,
    "brandId",
    "categoryId",
    "supplierId",
    "createdAt",
    "updatedAt"
  )
  SELECT
    gen_random_uuid(),
    d.sku,
    COALESCE(d.description, ''),
    d.available,
    d.margin,
    br.id,
    cat.id,
    sup.id,
    now(),
    now()
  FROM dedup d
  LEFT JOIN "Brand" br ON br.name = d.brand
  LEFT JOIN "Category" cat ON cat.name = d.category
  LEFT JOIN "Supplier" sup ON sup.name = d.supplier
  ON CONFLICT (sku) DO UPDATE SET
    description   = EXCLUDED.description,
    available     = EXCLUDED.available,
    margin        = EXCLUDED.margin,
    "brandId"     = EXCLUDED."brandId",
    "categoryId"  = EXCLUDED."categoryId",
    "supplierId"  = EXCLUDED."supplierId",
    "updatedAt"   = now()
  RETURNING 1
)
  SELECT count(*) INTO v_products_upserted FROM upserted;

  RETURN v_products_upserted;
END;
$function$
