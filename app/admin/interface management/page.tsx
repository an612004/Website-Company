import React, { useState } from 'react';
import { LayoutDashboard, Image, Trash2, Plus, AlertTriangle, X, Images, Edit2, Link2, Award } from 'lucide-react';

// Khởi tạo State với dữ liệu RỖNG
interface Banner {
    _id: string;
    url: string;
    alt?: string;
}

interface SliderImage {
    _id: string;
    url: string;
    alt?: string;
    link?: string;
    order?: number;
}

interface Logo {
    _id: string;
    url: string;
    alt?: string;
    link?: string;
    order?: number;
}

// Khởi tạo banner rỗng, chỉ hiển thị banner upload thực tế
const INITIAL_BANNERS_STATE: Banner[] = [];
const INITIAL_SLIDERS_STATE: SliderImage[] = [];
const INITIAL_LOGOS_STATE: Logo[] = [];

// Custom Modal Component (Dùng Tailwind CSS)
interface CustomModalProps {
    message: string;
    onClose: () => void;
}
const CustomModal = ({ message, onClose }: CustomModalProps) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="text-red-500 w-6 h-6 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800 flex-grow">Thông Báo Hệ Thống</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
                onClick={onClose}
                className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition duration-150"
            >
                Đã hiểu
            </button>
        </div>
    </div>
);

function InterfaceManagementPage() {
    const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS_STATE);
    const [sliders, setSliders] = useState<SliderImage[]>(INITIAL_SLIDERS_STATE);
    const [logos, setLogos] = useState<Logo[]>(INITIAL_LOGOS_STATE);

    React.useEffect(() => {
        // Lấy danh sách banner từ DB khi trang mở
        const fetchBanners = async () => {
            try {
                const res = await fetch('/api/banners');
                const data = await res.json();
                if (data.banners) setBanners(data.banners);
            } catch (err) {
                console.error('Lỗi lấy danh sách banner:', err);
            }
        };

        // Lấy danh sách slider từ DB
        const fetchSliders = async () => {
            try {
                const res = await fetch('/api/sliders');
                const data = await res.json();
                if (data.sliders) setSliders(data.sliders);
            } catch (err) {
                console.error('Lỗi lấy danh sách slider:', err);
            }
        };

        // Lấy danh sách logo từ DB
        const fetchLogos = async () => {
            try {
                const res = await fetch('/api/logos');
                const data = await res.json();
                if (data.logos) setLogos(data.logos);
            } catch (err) {
                console.error('Lỗi lấy danh sách logo:', err);
            }
        };

        fetchBanners();
        fetchSliders();
        fetchLogos();
    }, []);

    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadingSlider, setUploadingSlider] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedSliderFile, setSelectedSliderFile] = useState<File | null>(null);
    const [sliderName, setSliderName] = useState<string>('');  // Tên slider
    const [sliderLink, setSliderLink] = useState<string>('');  // Link slider
    const [editingSlider, setEditingSlider] = useState<string | null>(null);  // ID slider đang chỉnh sửa
    const [editSliderName, setEditSliderName] = useState<string>('');  // Tên mới khi chỉnh sửa
    const [editSliderLink, setEditSliderLink] = useState<string>('');  // Link mới khi chỉnh sửa

    // States cho Logo nhãn hàng
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
    const [logoName, setLogoName] = useState<string>('');
    const [logoLink, setLogoLink] = useState<string>('');
    const [editingLogo, setEditingLogo] = useState<string | null>(null);
    const [editLogoName, setEditLogoName] = useState<string>('');
    const [editLogoLink, setEditLogoLink] = useState<string>('');

    const showModal = (message: string) => setModalMessage(message);
    const closeModal = () => setModalMessage(null);

    // Xử lý chọn file banner
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            console.log('File đã chọn:', e.target.files[0]);
        } else {
            console.log('Không có file nào được chọn');
        }
    };

    // Xử lý chọn file slider
    const handleSliderFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedSliderFile(e.target.files[0]);
            console.log('File slider đã chọn:', e.target.files[0]);
        } else {
            console.log('Không có file slider nào được chọn');
        }
    };

    // Xử lý upload ảnh lên Cloudinary
    const handleUploadBanner = async () => {
        if (!selectedFile) {
            showModal('Vui lòng chọn file ảnh trước khi upload.');
            return;
        }
        if (banners.length >= 3) {
            showModal('Chỉ được phép tối đa 3 ảnh Banner.');
            return;
        }
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            const res = await fetch('/api/upload-banner', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                // Lưu banner vào DB
                const saveRes = await fetch('/api/banners', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: data.url, alt: selectedFile.name }),
                });
                const saveData = await saveRes.json();
                if (saveData.success) {
                    // Lấy lại danh sách banner từ DB
                    const listRes = await fetch('/api/banners');
                    const listData = await listRes.json();
                    if (listData.banners) setBanners(listData.banners);
                    setSelectedFile(null);
                    showModal('Đã upload và lưu ảnh banner thành công!');
                } else {
                    showModal('Upload thành công nhưng lưu DB thất bại: ' + (saveData.error || 'Không rõ lý do'));
                }
            } else {
                showModal('Upload thất bại: ' + (data.error || 'Không rõ lý do'));
            }
        } catch (err) {
            showModal('Lỗi upload: ' + String(err));
        }
        setUploading(false);
    };

    const handleDeleteBanner = async (id: string) => {
        try {
            const res = await fetch(`/api/banners?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                // Lấy lại danh sách banner từ DB
                const listRes = await fetch('/api/banners');
                const listData = await listRes.json();
                if (listData.banners) setBanners(listData.banners);
                showModal('Đã xóa banner thành công!');
            } else {
                showModal('Xóa banner thất bại: ' + (data.error || 'Không rõ lý do'));
            }
        } catch (err) {
            showModal('Lỗi xóa banner: ' + String(err));
        }
    };

    // Thêm hàm xử lý lưu toàn bộ cấu hình banner (nếu cần)
    const handleSaveBanners = () => {
        console.log('Dữ liệu Banners sẽ gửi đi:', banners);
        showModal('CHỨC NĂNG (MOCK): Đã gửi dữ liệu Banners lên Backend để lưu.');
    }

    // Xử lý upload ảnh slider lên Cloudinary
    const handleUploadSlider = async () => {
        if (!selectedSliderFile) {
            showModal('Vui lòng chọn file ảnh trước khi upload.');
            return;
        }
        if (!sliderName.trim()) {
            showModal('Vui lòng nhập tên cho slider.');
            return;
        }
        if (sliders.length >= 5) {
            showModal('Chỉ được phép tối đa 5 ảnh Slider.');
            return;
        }
        setUploadingSlider(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedSliderFile);
            const res = await fetch('/api/upload-banner', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                // Lưu slider vào DB với tên và link tùy chỉnh
                const saveRes = await fetch('/api/sliders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: data.url, alt: sliderName.trim(), link: sliderLink.trim(), order: sliders.length }),
                });
                const saveData = await saveRes.json();
                if (saveData.success) {
                    // Lấy lại danh sách slider từ DB
                    const listRes = await fetch('/api/sliders');
                    const listData = await listRes.json();
                    if (listData.sliders) setSliders(listData.sliders);
                    setSelectedSliderFile(null);
                    setSliderName('');  // Reset tên slider
                    setSliderLink('');  // Reset link slider
                    showModal('Đã upload và lưu ảnh slider thành công!');
                } else {
                    showModal('Upload thành công nhưng lưu DB thất bại: ' + (saveData.error || 'Không rõ lý do'));
                }
            } else {
                showModal('Upload thất bại: ' + (data.error || 'Không rõ lý do'));
            }
        } catch (err) {
            showModal('Lỗi upload: ' + String(err));
        }
        setUploadingSlider(false);
    };

    // Xử lý xóa slider
    const handleDeleteSlider = async (id: string) => {
        try {
            const res = await fetch(`/api/sliders?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                // Lấy lại danh sách slider từ DB
                const listRes = await fetch('/api/sliders');
                const listData = await listRes.json();
                if (listData.sliders) setSliders(listData.sliders);
                showModal('Đã xóa slider thành công!');
            } else {
                showModal('Xóa slider thất bại: ' + (data.error || 'Không rõ lý do'));
            }
        } catch (err) {
            showModal('Lỗi xóa slider: ' + String(err));
        }
    };

    // Lưu cấu hình slider
    const handleSaveSliders = () => {
        console.log('Dữ liệu Sliders sẽ gửi đi:', sliders);
        showModal('CHỨC NĂNG (MOCK): Đã gửi dữ liệu Sliders lên Backend để lưu.');
    }

    // Cập nhật tên và link slider
    const handleUpdateSliderName = async (id: string) => {
        if (!editSliderName.trim()) {
            showModal('Tên slider không được để trống.');
            return;
        }
        try {
            const res = await fetch('/api/sliders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, alt: editSliderName.trim(), link: editSliderLink.trim() }),
            });
            const data = await res.json();
            if (data.success) {
                // Lấy lại danh sách slider từ DB
                const listRes = await fetch('/api/sliders');
                const listData = await listRes.json();
                if (listData.sliders) setSliders(listData.sliders);
                setEditingSlider(null);
                setEditSliderName('');
                setEditSliderLink('');
                showModal('Đã cập nhật slider thành công!');
            } else {
                showModal('Cập nhật thất bại: ' + (data.error || 'Không rõ lý do'));
            }
        } catch (err) {
            showModal('Lỗi cập nhật: ' + String(err));
        }
    };

    // ========== XỬ LÝ LOGO NHÃN HÀNG ==========

    // Xử lý chọn file logo
    const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedLogoFile(e.target.files[0]);
            console.log('File logo đã chọn:', e.target.files[0]);
        }
    };

    // Xử lý upload logo
    const handleUploadLogo = async () => {
        if (!selectedLogoFile) {
            showModal('Vui lòng chọn file ảnh logo trước khi upload.');
            return;
        }
        if (logos.length >= 10) {
            showModal('Chỉ được phép tối đa 10 logo nhãn hàng.');
            return;
        }
        setUploadingLogo(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedLogoFile);
            const res = await fetch('/api/upload-banner', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                // Lưu logo vào DB
                const saveRes = await fetch('/api/logos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        url: data.url,
                        alt: logoName.trim() || selectedLogoFile.name,
                        link: logoLink.trim(),
                        order: logos.length
                    }),
                });
                const saveData = await saveRes.json();
                if (saveData.success) {
                    // Lấy lại danh sách logo từ DB
                    const listRes = await fetch('/api/logos');
                    const listData = await listRes.json();
                    if (listData.logos) setLogos(listData.logos);
                    setSelectedLogoFile(null);
                    setLogoName('');
                    setLogoLink('');
                    showModal('Đã upload và lưu logo thành công!');
                } else {
                    showModal('Upload thành công nhưng lưu DB thất bại: ' + (saveData.error || 'Không rõ lý do'));
                }
            } else {
                showModal('Upload thất bại: ' + (data.error || 'Không rõ lý do'));
            }
        } catch (err) {
            showModal('Lỗi upload: ' + String(err));
        }
        setUploadingLogo(false);
    };

    // Xử lý xóa logo
    const handleDeleteLogo = async (id: string) => {
        try {
            const res = await fetch(`/api/logos?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                const listRes = await fetch('/api/logos');
                const listData = await listRes.json();
                if (listData.logos) setLogos(listData.logos);
                showModal('Đã xóa logo thành công!');
            } else {
                showModal('Xóa logo thất bại: ' + (data.error || 'Không rõ lý do'));
            }
        } catch (err) {
            showModal('Lỗi xóa logo: ' + String(err));
        }
    };

    // Cập nhật thông tin logo
    const handleUpdateLogo = async (id: string) => {
        try {
            const res = await fetch('/api/logos', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, alt: editLogoName.trim(), link: editLogoLink.trim() }),
            });
            const data = await res.json();
            if (data.success) {
                const listRes = await fetch('/api/logos');
                const listData = await listRes.json();
                if (listData.logos) setLogos(listData.logos);
                setEditingLogo(null);
                setEditLogoName('');
                setEditLogoLink('');
                showModal('Đã cập nhật logo thành công!');
            } else {
                showModal('Cập nhật thất bại: ' + (data.error || 'Không rõ lý do'));
            }
        } catch (err) {
            showModal('Lỗi cập nhật: ' + String(err));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="mb-8 border-b pb-4">
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <LayoutDashboard className="w-7 h-7 text-indigo-600" />
                        Quản lý Giao diện Hệ thống
                    </h1>
                    <p className="text-gray-500 mt-1">Chỉ quản lý hình ảnh nổi bật (Banner).</p>
                </header>

                <hr className="mb-8" />

                {/* ========================================= */}
                {/* 🖼️ PHẦN QUẢN LÝ BANNER (Tối đa 3 ảnh) */}
                {/* ========================================= */}
                <section className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <Image className="w-5 h-5 text-purple-500" />
                            Banner Trang chủ (<span className="font-bold text-indigo-600">{banners.length}/3</span>)
                        </h2>
                        <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading || banners.length >= 3} />
                        <button
                            onClick={() => {
                                console.log('Trạng thái:', { uploading, bannersLength: banners.length, selectedFile });
                                handleUploadBanner();
                            }}
                            disabled={uploading || banners.length >= 3 || !selectedFile}
                            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ml-2
                                ${uploading || banners.length >= 3 || !selectedFile
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'}`}
                        >
                            {uploading ? 'Đang upload...' : 'Thêm Ảnh Banner'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {banners.length === 0 ? (
                            <div className="lg:col-span-3 p-10 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                                <Image className="w-8 h-8 mx-auto mb-2" />
                                <p>Chưa có banner nào được tải lên. Nhấn **Thêm Ảnh Banner** để bắt đầu.</p>
                            </div>
                        ) : (
                            banners.map((banner) => (
                                <div
                                    key={banner._id}
                                    className="relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                                >
                                    {/* Image Preview */}
                                    <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm">
                                        <img src={banner.url} alt={banner.alt || 'Banner'} style={{ maxWidth: '100%', maxHeight: '120px', objectFit: 'cover' }} />
                                    </div>

                                    <div className="p-4">
                                        <p className="font-semibold text-gray-700 truncate mb-1" title={banner.alt}>
                                            Mô tả: **{banner.alt || 'Không có mô tả'}**
                                        </p>
                                        <p className="text-xs text-indigo-500 truncate" title={banner.url}>
                                            URL: {banner.url}
                                        </p>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDeleteBanner(banner._id)}
                                            className="absolute top-3 right-3 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-md"
                                            title="Xóa Banner này"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {banners.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={handleSaveBanners}
                                className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition duration-200 flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Lưu Cấu hình Banner
                            </button>
                        </div>
                    )}
                </section>

                {/* ========================================= */}
                {/* 🖼️ PHẦN QUẢN LÝ SLIDER (Tối đa 5 ảnh) */}
                {/* ========================================= */}
                <section className="bg-white p-6 rounded-xl shadow-lg mt-8">
                    <div className="flex flex-wrap justify-between items-center mb-6 border-b pb-4 gap-4">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <Images className="w-5 h-5 text-orange-500" />
                            Slider Giao diện Web (<span className="font-bold text-orange-600">{sliders.length}/5</span>)
                        </h2>
                    </div>

                    {/* Form thêm slider mới */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Thêm Slider Mới</h3>
                        <div className="flex flex-wrap items-end gap-3">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-xs text-gray-500 mb-1">Tên giao diện *</label>
                                <input
                                    type="text"
                                    value={sliderName}
                                    onChange={(e) => setSliderName(e.target.value)}
                                    placeholder="VD: Giao diện bán hàng"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    disabled={uploadingSlider || sliders.length >= 5}
                                />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-xs text-gray-500 mb-1">Đường dẫn link (tùy chọn)</label>
                                <input
                                    type="text"
                                    value={sliderLink}
                                    onChange={(e) => setSliderLink(e.target.value)}
                                    placeholder="VD: https://example.com/san-pham"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    disabled={uploadingSlider || sliders.length >= 5}
                                />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-xs text-gray-500 mb-1">Chọn ảnh *</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleSliderFileChange}
                                    disabled={uploadingSlider || sliders.length >= 5}
                                    className="text-sm w-full"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    console.log('Trạng thái slider:', { uploadingSlider, slidersLength: sliders.length, selectedSliderFile, sliderName, sliderLink });
                                    handleUploadSlider();
                                }}
                                disabled={uploadingSlider || sliders.length >= 5 || !selectedSliderFile || !sliderName.trim()}
                                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200
                                    ${uploadingSlider || sliders.length >= 5 || !selectedSliderFile || !sliderName.trim()
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg'}`}
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                {uploadingSlider ? 'Đang upload...' : 'Thêm Slider'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {sliders.length === 0 ? (
                            <div className="lg:col-span-5 p-10 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                                <Images className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                                <p>Chưa có ảnh slider nào. Nhấn <strong>Thêm Ảnh Slider</strong> để bắt đầu.</p>
                            </div>
                        ) : (
                            sliders.map((slider, index) => (
                                <div
                                    key={slider._id}
                                    className="relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group"
                                >
                                    {/* Order Badge */}
                                    <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {index + 1}
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDeleteSlider(slider._id)}
                                        className="absolute top-2 right-2 z-10 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-md opacity-0 group-hover:opacity-100"
                                        title="Xóa ảnh slider này"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Image Preview */}
                                    <div className="w-full h-36 bg-gray-100 flex items-center justify-center">
                                        <img
                                            src={slider.url}
                                            alt={slider.alt || 'Slider'}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="p-3">
                                        {editingSlider === slider._id ? (
                                            // Mode chỉnh sửa
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={editSliderName}
                                                    onChange={(e) => setEditSliderName(e.target.value)}
                                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-orange-500"
                                                    placeholder="Nhập tên mới"
                                                    autoFocus
                                                />
                                                <input
                                                    type="text"
                                                    value={editSliderLink}
                                                    onChange={(e) => setEditSliderLink(e.target.value)}
                                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-orange-500"
                                                    placeholder="Nhập link (để trống nếu không cần)"
                                                />
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleUpdateSliderName(slider._id)}
                                                        className="flex-1 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                                                    >
                                                        Lưu
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingSlider(null);
                                                            setEditSliderName('');
                                                            setEditSliderLink('');
                                                        }}
                                                        className="flex-1 px-2 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500"
                                                    >
                                                        Hủy
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // Mode hiển thị
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-gray-700 truncate flex-1" title={slider.alt}>
                                                        {slider.alt || 'Chưa có tên'}
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            setEditingSlider(slider._id);
                                                            setEditSliderName(slider.alt || '');
                                                            setEditSliderLink(slider.link || '');
                                                        }}
                                                        className="ml-2 p-1 text-gray-400 hover:text-orange-500 transition-colors"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                {slider.link && (
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Link2 className="w-3 h-3 text-blue-500" />
                                                        <a
                                                            href={slider.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-blue-500 hover:underline truncate"
                                                            title={slider.link}
                                                        >
                                                            {slider.link.length > 25 ? slider.link.substring(0, 25) + '...' : slider.link}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {sliders.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={handleSaveSliders}
                                className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition duration-200 flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Lưu Cấu hình Slider
                            </button>
                        </div>
                    )}
                </section>

                {/* ========================================= */}
                {/* 🏷️ PHẦN QUẢN LÝ LOGO NHÃN HÀNG (Tối đa 10 ảnh) */}
                {/* ========================================= */}
                <section className="bg-white p-6 rounded-xl shadow-lg mt-8">
                    <div className="flex flex-wrap justify-between items-center mb-6 border-b pb-4 gap-4">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <Award className="w-5 h-5 text-emerald-500" />
                            Logo Nhãn Hàng / Đối Tác (<span className="font-bold text-emerald-600">{logos.length}/10</span>)
                        </h2>
                    </div>

                    {/* Form thêm logo mới */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Thêm Logo Mới</h3>
                        <div className="flex flex-wrap items-end gap-3">
                            <div className="flex-1 min-w-[180px]">
                                <label className="block text-xs text-gray-500 mb-1">Tên nhãn hàng (tùy chọn)</label>
                                <input
                                    type="text"
                                    value={logoName}
                                    onChange={(e) => setLogoName(e.target.value)}
                                    placeholder="VD: Samsung, Apple..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    disabled={uploadingLogo || logos.length >= 10}
                                />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-xs text-gray-500 mb-1">Đường dẫn website (tùy chọn)</label>
                                <input
                                    type="text"
                                    value={logoLink}
                                    onChange={(e) => setLogoLink(e.target.value)}
                                    placeholder="VD: https://samsung.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    disabled={uploadingLogo || logos.length >= 10}
                                />
                            </div>
                            <div className="flex-1 min-w-[180px]">
                                <label className="block text-xs text-gray-500 mb-1">Chọn ảnh logo *</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoFileChange}
                                    disabled={uploadingLogo || logos.length >= 10}
                                    className="text-sm w-full"
                                />
                            </div>
                            <button
                                onClick={handleUploadLogo}
                                disabled={uploadingLogo || logos.length >= 10 || !selectedLogoFile}
                                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200
                                    ${uploadingLogo || logos.length >= 10 || !selectedLogoFile
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md hover:shadow-lg'}`}
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                {uploadingLogo ? 'Đang upload...' : 'Thêm Logo'}
                            </button>
                        </div>
                    </div>

                    {/* Danh sách logo */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {logos.length === 0 ? (
                            <div className="col-span-full p-10 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                                <Award className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                                <p>Chưa có logo nhãn hàng nào. Nhấn <strong>Thêm Logo</strong> để bắt đầu.</p>
                            </div>
                        ) : (
                            logos.map((logo, index) => (
                                <div
                                    key={logo._id}
                                    className="relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group"
                                >
                                    {/* Order Badge */}
                                    <div className="absolute top-2 left-2 z-10 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {index + 1}
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDeleteLogo(logo._id)}
                                        className="absolute top-2 right-2 z-10 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-md opacity-0 group-hover:opacity-100"
                                        title="Xóa logo này"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Logo Image Preview */}
                                    <div className="w-full h-24 bg-gray-50 flex items-center justify-center p-3">
                                        {logo.link ? (
                                            <a href={logo.link} target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center">
                                                <img
                                                    src={logo.url}
                                                    alt={logo.alt || 'Logo'}
                                                    className="max-w-full max-h-full object-contain hover:scale-105 transition-transform"
                                                />
                                            </a>
                                        ) : (
                                            <img
                                                src={logo.url}
                                                alt={logo.alt || 'Logo'}
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        )}
                                    </div>

                                    <div className="p-2 border-t border-gray-100">
                                        {editingLogo === logo._id ? (
                                            // Mode chỉnh sửa
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={editLogoName}
                                                    onChange={(e) => setEditLogoName(e.target.value)}
                                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500"
                                                    placeholder="Tên nhãn hàng"
                                                    autoFocus
                                                />
                                                <input
                                                    type="text"
                                                    value={editLogoLink}
                                                    onChange={(e) => setEditLogoLink(e.target.value)}
                                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500"
                                                    placeholder="Link website"
                                                />
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleUpdateLogo(logo._id)}
                                                        className="flex-1 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                                                    >
                                                        Lưu
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingLogo(null);
                                                            setEditLogoName('');
                                                            setEditLogoLink('');
                                                        }}
                                                        className="flex-1 px-2 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500"
                                                    >
                                                        Hủy
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // Mode hiển thị
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-medium text-gray-700 truncate flex-1" title={logo.alt}>
                                                        {logo.alt || 'Chưa có tên'}
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            setEditingLogo(logo._id);
                                                            setEditLogoName(logo.alt || '');
                                                            setEditLogoLink(logo.link || '');
                                                        }}
                                                        className="ml-1 p-1 text-gray-400 hover:text-emerald-500 transition-colors"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                {logo.link && (
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Link2 className="w-3 h-3 text-blue-500 flex-shrink-0" />
                                                        <a
                                                            href={logo.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-blue-500 hover:underline truncate"
                                                            title={logo.link}
                                                        >
                                                            {logo.link.length > 20 ? logo.link.substring(0, 20) + '...' : logo.link}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Custom Modal */}
                {modalMessage && <CustomModal message={modalMessage} onClose={closeModal} />}
            </div>
        </div>
    );
}

export default InterfaceManagementPage;