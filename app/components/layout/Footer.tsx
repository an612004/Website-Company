

function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-4 mt-8">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} Công Ty Của Bạn. Tất cả các quyền được bảo lưu.</p>
            </div>
        </footer>
    );
}
export default Footer;