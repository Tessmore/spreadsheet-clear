const Footer = () => {
    return (
        <footer className="mt-8 py-4 text-center text-gray-500 text-sm">
            <div className="flex justify-center items-center gap-8">
                <p>{new Date().getFullYear()} F. Tesselaar</p>
                <p>MIT License</p>

                <a
                    href="https://github.com/Tessmore/spreadsheet-clear/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 underline"
                >
                    Report issues
                </a>
            </div>
        </footer>
    );
};

export default Footer;
