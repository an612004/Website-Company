import Sidebar from "../components/ui/Sidebar";
function adminPage() {

    return (
        <div className="w-64 h-screen bg-sky-100 shadow-md p-4 flex flex-col gap-2">
            <h1>Admin Page - Anbi</h1>
            <Sidebar />

        </div>
    );
}
export default adminPage;