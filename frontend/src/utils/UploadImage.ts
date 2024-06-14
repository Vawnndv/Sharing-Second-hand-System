// uploadToAws3.ts

const UploadImageToAws3 = async (file: any, isLimit: boolean) => {
  try {
    // Đọc nội dung của tệp tin bằng FileReader
    const fileReader: any = new FileReader();
    fileReader.readAsDataURL(file);

    return await new Promise((resolve, reject) => {
      fileReader.onload = async () => {
        try {
          // Chuyển đổi nội dung của tệp thành dạng Base64
          const fileContent = fileReader.result.split(',')[1];

          // Tạo FormData và thêm tệp tin và thông tin vào đó
          const formData = new FormData();
          formData.append('file', fileContent);
          formData.append('name', `${new Date().getTime()}${file.name}`);
          formData.append('type', file.type);
          if(isLimit){
            formData.append('typeExpire', "expire")
          }
          // Gửi FormData qua phương thức POST
          const serverResponse = await fetch(`http://localhost:3000/aws3/uploadImage`, {
            method: 'POST',
            body: formData,
          });

          // Xử lý phản hồi từ server nếu cần
          const data = await serverResponse.json();
          console.log('Server response:', data);

          resolve(data);
        } catch (error) {
          console.error('Error uploading file:', error);
          reject(error);
        }
      };
    });
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
};

export default UploadImageToAws3;
