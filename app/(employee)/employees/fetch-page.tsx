import { getAllUsers } from "@/lib/actions/users/get-users";
import { UserTable } from "./components/employee-table";

export async function EmployeeTableWrapper() {
    const users = await getAllUsers();

    
    return (
        <div className="p-4">
            <UserTable users={users}/>
        </div>
        
    )
}