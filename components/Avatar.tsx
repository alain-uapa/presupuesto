import React from 'react';

const Avatar = ({ picture }: { picture: string }) => (
  <div className="w-8 h-8 bg-[#003B71] rounded-full flex items-center justify-center shadow-sm">
    <img src={picture} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />
  </div>
);
export default Avatar;