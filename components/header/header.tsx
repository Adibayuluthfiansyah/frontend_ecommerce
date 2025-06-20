"use client";

import React from 'react'
function Header() {
  return (
    <div className='flex justify-between p-5 shadow-sm'>
        <div className='flex gap-3 items-center'>
            <h2 className='text-[25px] font-semibold cursor-pointer hover:text-blue-600 tracking-widest'>LOGO</h2>
        </div>
        <ul className='flex gap-8 items-center'>
          <li className='text-[18px] hover:text-blue-600 cursor-pointer'>Home</li>
          <li className='text-[18px] hover:text-blue-600 cursor-pointer'>About Us</li>
          <li className='text-[18px] hover:text-blue-600 cursor-pointer'>Contact</li>
        </ul>
    </div>
  )
}

export default Header