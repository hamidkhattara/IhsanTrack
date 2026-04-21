import z from '../assets/Icons/Vector.png'
import q from '../assets/Icons/johann-siemens-EPy0gBJzzZU-unsplash.jpg'
import { useNavigate } from 'react-router-dom'

const User_sign_up = () => {
  const navigate = useNavigate();
  return (
<div className="h-screen w-full flex">
         <div className="relative h-full w-1/2">
  <img className="w-full h-full object-cover" src={q} alt="" />
  <div className="absolute inset-0 bg-linear-to-b from-[#064E3B]/2  to-[#064E3B]"></div>
  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
    <h2 className="text-5xl mt-110 text-white  ">نسعى لازدهار الجزائر</h2>
    <br />
    <p className="text-xl w-100 text-gray-400">من خلال طريق الاحسان نحاول الربط بين المتبرع و الجمعيات الخيرية </p>
  </div>
</div>

          <div className="flex flex-col items-center justify-center w-1/2 h-screen bg-[#10221C]">
               <div className='flex gap-3 ml-30'><img src={z} alt="" /><h2 className="text-2xl text-white">  طريق الاحسان </h2></div>
               <br />
               <h3 className="text-3xl ml-20 text-white"> إنشاء حساب جديد</h3>
               <br />
               <p className="text-md text-gray-400">  انضم إلى مجتمعنا وساهم في بناء مستقبل أفضل.  </p>
                <br />
               <p className="text-md  text-gray-300 ml-55"> الاسم الكامل  </p>
               <input type="text" placeholder="الاسم و اللقب" className="w-80 h-9 pr-2 pl-2 text-sm text-white  border border-gray-700 rounded-md  placeholder-gray-600" />
                <br />
               <p className="text-md  text-gray-300 ml-55"> البريد الإلكتروني </p>
               <input type="email" placeholder="name@example.com" className="w-80 h-9 pr-2 pl-2 text-sm text-white  border border-gray-700 rounded-md  placeholder-gray-600" />
                <br />
               <p className="text-md  text-gray-300 ml-60"> رقم الهاتف</p>
               <input type="email" placeholder=" 55 55 55 55 213+" className="w-80 h-9 pr-2 pl-2 text-sm text-white  border border-gray-700 rounded-md  placeholder-gray-600" />
                <br />
               <p className="text-sm  ml-60 text-gray-300">كلمة المرور</p>
               <input type="password"  placeholder="••••••••" className="w-80 h-9 pr-2 pl-2 text-sm text-white  border border-gray-700 rounded-md  placeholder-gray-600"/>
                <br />
               <p className="text-sm  ml-55 text-gray-300"> تأكيد كلمة المرور</p>
               <input type="password"  placeholder="••••••••" className="w-80 h-9 pr-2 pl-2 text-sm text-white  border border-gray-700 rounded-md  placeholder-gray-600"/>
                <br />
                <button  className="w-70 h-9 pr-2 pl-2 text-md text-white  border border-gray-700 rounded-md bg-green-700 hover:cursor-pointer hover:bg-green-600">إنشاء الحساب</button>
                <br />
               <div className="flex"><p className="text-sm text-gray-300 ">هل لديك حساب بالفعل ؟ </p> <p onClick={()=>navigate("/user_sign_in")} className=' text-[#25c481] hover:text-[#1e9e68] hover:cursor-pointer '>تسجيل الدخول</p></div>

          </div>
    </div>
  )
}

export default User_sign_up