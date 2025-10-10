import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'

const uploadOnCloudinary = async(file)=>{
  try {
     cloudinary.config({
        cloud_name : process.env.CLOUDINARY_CLOUDNAME,
        api_key : process.env.CLOUDINARY_API_KEY,
        api_secret : process.env.CLOUDINARY_API_SECRET
        
    });

   const reuslt = await cloudinary.uploader.upload(file,{resource_type : 'auto'});

    fs.unlinkSync(file);

   return reuslt.secure_url;
  } catch (error) {
    console.log(error);
    
    fs.unlinkSync(file);
  }
}


export default uploadOnCloudinary;