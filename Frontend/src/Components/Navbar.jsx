import q from '../assets/Icons/q.png'
import { NavLink } from 'react-router-dom'
const Navbar = () => {
  const navLinkClasses = ({ isActive }) => 
    `transition-colors duration-500 text-lg hover:text-[#10B77F] ${
      isActive ? "text-[#10B77F] " : "text-white"
    }`;
  return (
    <div className='flex h-18 bg-[#102720]'>
      <div className='flex mr-6 mt-4 gap-1'>
       <img className='w-10 h-10' src={q} alt="" /><h1 className='text-white mr-2 text-3xl'>طريق</h1><h1 className='text-[#10B77F] text-3xl'>الاحسان</h1>
      </div>
      <div>
        <nav className='flex mr-60 mt-5 gap-13'>
         <NavLink className={navLinkClasses} to='/'>الرئيسية</NavLink>
         <NavLink className={navLinkClasses} to='/associations'>الجمعيات</NavLink>
         <NavLink className={navLinkClasses} to='/campaigns'>الحملات</NavLink>
         <NavLink className={navLinkClasses} to='/events'>الفعاليات</NavLink>
         <NavLink className={navLinkClasses} to='/about_us'>من نحن</NavLink>
        </nav>
      </div>
      <div className='flex mr-50 mt-4 gap-9'>
       <NavLink className="text-white transition-transform duration-300 bg-[#10B77F] hover:scale-103 h-10 w-27 pr-6 pt-1 rounded-lg text-lg" to='/donate'>تبرع الان</NavLink>
       <NavLink className="text-white transition-colors duration-500 hover:text-[#10B77F] mt-1 mr-2 text-lg" to='/user_sign_in'>تسجيل الدخول</NavLink>
      </div>
    </div>
  )
}

export default Navbar