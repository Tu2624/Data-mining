import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import useStore from '../store/useStore';

const Register = () => {
    const navigate = useNavigate();
    const { setUser } = useStore();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            return alert('Mật khẩu xác nhận không khớp!');
        }

        setLoading(true);
        try {
            const res = await client.post('/auth/register', {
                username: form.username,
                email: form.email,
                password: form.password
            });
            // Tự động đăng nhập sau khi đăng ký
            const loginRes = await client.post('/auth/login', {
                email: form.email,
                password: form.password
            });
            setUser(loginRes.data.user, loginRes.data.token);
            
            alert('Chào mừng bạn đến với FoodRec AI!');
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.error || 'Lỗi khi đăng ký');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-[32px] p-10 shadow-premium">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-50 rounded-3xl text-primary-500 mb-6 shadow-soft">
                        <Utensils size={40} />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 leading-tight">Gia nhập FoodRec</h1>
                    <p className="text-gray-400 font-bold mt-2">Bắt đầu hành trình khám phá ẩm thực AI</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Tên người dùng</label>
                        <div className="relative">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text" 
                                value={form.username}
                                onChange={(e) => setForm({...form, username: e.target.value})}
                                placeholder="Nhập tên của bạn..." 
                                className="w-full bg-gray-50 rounded-2xl pl-14 pr-6 py-5 border-2 border-transparent focus:border-primary-500 outline-none font-bold transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="email" 
                                value={form.email}
                                onChange={(e) => setForm({...form, email: e.target.value})}
                                placeholder="example@gmail.com" 
                                className="w-full bg-gray-50 rounded-2xl pl-14 pr-6 py-5 border-2 border-transparent focus:border-primary-500 outline-none font-bold transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="password" 
                                    value={form.password}
                                    onChange={(e) => setForm({...form, password: e.target.value})}
                                    placeholder="••••••••" 
                                    className="w-full bg-gray-50 rounded-2xl pl-14 pr-6 py-5 border-2 border-transparent focus:border-primary-500 outline-none font-bold transition-all"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Xác nhận</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="password" 
                                    value={form.confirmPassword}
                                    onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                                    placeholder="••••••••" 
                                    className="w-full bg-gray-50 rounded-2xl pl-14 pr-6 py-5 border-2 border-transparent focus:border-primary-500 outline-none font-bold transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-primary-500 text-white py-5 rounded-2xl font-black text-xl shadow-premium hover:shadow-none hover:translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? 'Đang khởi tạo...' : (
                            <>
                                Đăng ký ngay <LogIn size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-50 text-center">
                    <p className="text-gray-400 font-bold">
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="text-primary-500 hover:underline">Đăng nhập</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
