import { SinhVien } from "../models/SinhVien.js";
import { stringToSlug, validateName, validateEmail, validatePhone, validateDate, validateNumber} from "../assets/util/method.js";

let arrSV = [];
document.querySelector('#frmSinhVien').onsubmit = async function (e) {
    e.preventDefault();

    let svMoi = new SinhVien();
    let arrInput = document.querySelectorAll('#frmSinhVien .form-control');

    // Validate
    let hasError = validateInputData(arrInput);
    if (!hasError) {
        for(let input of arrInput){
            let id = input.id;
            let value = input.value;
            svMoi[id] = value;
        }
        let svTonTai = arrSV.find(sv => sv.maSinhVien === svMoi.maSinhVien);
        if(!svTonTai){
            const response = await fetch('https://svcy.myclass.vn/api/SinhVienApi/themSinhVien',{
                method:'POST',
                headers: {
                    'Content-Type': 'Application/json'
                },
                body: JSON.stringify(svMoi)
            });
            const result = await response.json();
        
            // Clear validation message and form data
            resetData();
    
            renderTableSinhVien();
        } else {
            document.querySelector('#validationMessage').innerHTML = 'Sinh viên đã tồn tại';
        }
    }
}

window.resetData = function () {
    document.querySelector('.input-error-message').innerHTML = '';
    document.querySelector('#validationMessage').innerHTML = '';
    document.querySelector('#frmSinhVien').reset();
}

window.validateInputData = function (arrInput) { //input là mảng 
    let errorMess = '';
    for(let input of arrInput){
        // Validate
        if (input.id == 'maSinhVien' && (!input.value)) {
            errorMess = 'Mã sinh viên không hợp lệ';
            document.querySelector('#maSinhVienErrorMess').innerHTML = errorMess;
        }
        if (input.id == 'tenSinhVien' && (!input.value || !validateName(input.value))) {
            errorMess = 'Tên sinh viên không hợp lệ';
            document.querySelector('#tenSinhVienErrorMess').innerHTML = errorMess;
        }
        if (input.id == 'soDienThoai' && (!input.value || !validatePhone(input.value))) {
            errorMess = 'Số điện thoại không hợp lệ';
            document.querySelector('#soDienThoaiErrorMess').innerHTML = errorMess;
        }
        if (input.id == 'email' && (!input.value || !validateEmail(input.value))) {
            errorMess = 'Địa chỉ Email không hợp lệ';
            document.querySelector('#emailErrorMess').innerHTML = errorMess;
        }
        if (input.id == 'diemToan' && (!input.value || !validateNumber(input.value) || input.value > 10)) {
            errorMess = 'Điểm Toán không hợp lệ';
            document.querySelector('#diemToanErrorMess').innerHTML = errorMess;
        }
        if (input.id == 'diemLy' && (!input.value || !validateNumber(input.value) || input.value > 10)) {
            errorMess = 'Điểm Lý không hợp lệ';
            document.querySelector('#diemLyErrorMess').innerHTML = errorMess;
        }
        if (input.id == 'diemHoa' && (!input.value || !validateNumber(input.value) || input.value > 10)) {
            errorMess = 'Điểm Hóa không hợp lệ';
            document.querySelector('#diemHoaErrorMess').innerHTML = errorMess;
        }
        if (input.id == 'diemRenLuyen' && (!input.value || !validateNumber(input.value) || input.value > 10)) {
            errorMess = 'Điểm rèn luyện không hợp lệ';
            document.querySelector('#diemRenLuyenErrorMess').innerHTML = errorMess;
        }
    }
    return errorMess ? true : false;
}

window.renderTableSinhVien = async function () {
    let htmlString = ''

    const response = await fetch('https://svcy.myclass.vn/api/SinhVienApi/LayDanhSachSinhVien');
    arrSV = await response.json();

    for(let sv of arrSV){
        htmlString +=`
            <tr>
                <td>${sv.maSinhVien}</td>
                <td>${sv.tenSinhVien}</td>
                <td>${sv.soDienThoai}</td>
                <td>${sv.email}</td>
                <td>${sv.diemToan}</td>
                <td>${sv.diemLy}</td>
                <td>${sv.diemHoa}</td>
                <td>${sv.diemRenLuyen}</td>
                <td>${sv.loaiSinhVien}</td>
                <td>
                    <button class="btn btn-primary mx-2" onclick="chinhSua('${sv.maSinhVien}')">Chỉnh sửa</button>
                    <button class="btn btn-danger" onclick="xoaSinhVien('${sv.maSinhVien}')" >Xoá</button>
                </td>
            </tr>
        `
    }
    document.querySelector('#tblSinhVien').innerHTML = htmlString;

    if(arrSV.length > 0) {   
        document.querySelector('#ketQuaTimKiem').className = 'alert alert-success mt-2';
        document.querySelector('#ketQuaTimKiem').innerHTML = `Tìm thấy ${arrSV.length} sinh viên`;
    } else {
        document.querySelector('#ketQuaTimKiem').className = 'alert alert-danger mt-2';
        document.querySelector('#ketQuaTimKiem').innerHTML = `Không tìm thấy sinh viên nào`;
    }
    return htmlString;
}

renderTableSinhVien();

window.xoaSinhVien = async function (maSinhVien) {
    const response = await fetch(`https://svcy.myclass.vn/api/SinhVienApi/xoaSinhVien?maSinhVien=${maSinhVien}`, {
        method:'DELETE'
    });
    const result = await response.json();

    // Clear validation message and form data
    resetData();

    renderTableSinhVien();

    return result;
}

window.chinhSua = function (maSinhVien) {
    let svUpdate = arrSV.find(sv => sv.maSinhVien == maSinhVien);
    if(svUpdate) {
        document.querySelector('#btnThemSinhVien').disabled = true;
        for (let key in svUpdate){
            document.querySelector(`#${key}`).value = svUpdate[key];
        }
    }
}

document.querySelector('#btnLuuThongTin').onclick = async function(e) {
    let svEdit = new SinhVien();
    let arrInput = document.querySelectorAll('#frmSinhVien .form-control');

    // Validate
    let hasError = validateInputData(arrInput);
    if (!hasError) {
        for(let input of arrInput){
            let id = input.id;
            let value = input.value;
            svEdit[id] = value;
        }

        let svTonTai = arrSV.find(sv => sv.maSinhVien == svEdit.maSinhVien);
        if(svTonTai){
            const response = await fetch(`https://svcy.myclass.vn/api/SinhVienApi/CapNhatThongTinSinhVien?maSinhVien=${svEdit.maSinhVien}`,{
                method:'PUT',
                headers: {
                    'Content-Type': 'Application/json'
                },
                body: JSON.stringify(svEdit)
            });
            const result = await response.json();

            // Clear validation message and form data
            resetData();

            renderTableSinhVien();

            document.querySelector('#btnThemSinhVien').disabled = false;
        } else {
            document.querySelector('#validationMessage').innerHTML = 'Không tìm thấy sinh viên';
        }
    }
}

document.querySelector('#frmTimKiem').onsubmit = function(e) {
    e.preventDefault();
    let loaiTimKiem = document.querySelector('#loaiTimKiem').value;
    let tuKhoa = document.querySelector('#tuKhoa').value;
    if (loaiTimKiem == 'ten') {
        tuKhoa = stringToSlug(tuKhoa);
    }
    
    let arrKetQuaTimKiem = [];
    arrKetQuaTimKiem = arrSV.filter(sv => stringToSlug(sv[loaiTimKiem]).search(tuKhoa) !== -1);
    
    //Sau khi filter thì dùng mảng kết quả render lại table
    renderTableTimKiemSinhVien(arrKetQuaTimKiem);
}

window.renderTableTimKiemSinhVien = function (arrKetQuaTimKiem) {
    let htmlString = ''

    if (arrKetQuaTimKiem.length > 0) {   
        document.querySelector('#ketQuaTimKiem').className = 'alert alert-success mt-2';
        document.querySelector('#ketQuaTimKiem').innerHTML = `Tìm thấy ${arrKetQuaTimKiem.length} sinh viên`;
    } else {
        document.querySelector('#ketQuaTimKiem').className = 'alert alert-danger mt-2';
        document.querySelector('#ketQuaTimKiem').innerHTML = `Không tìm thấy sinh viên nào`;
    }

    for(let sv of arrKetQuaTimKiem){
        htmlString +=`
            <tr>
                <td>${sv.maSinhVien}</td>
                <td>${sv.tenSinhVien}</td>
                <td>${sv.soDienThoai}</td>
                <td>${sv.email}</td>
                <td>${sv.diemToan}</td>
                <td>${sv.diemLy}</td>
                <td>${sv.diemHoa}</td>
                <td>${sv.diemRenLuyen}</td>
                <td>${sv.loaiSinhVien}</td>
                <td>
                    <button class="btn btn-primary mx-2" onclick="chinhSua('${sv.maSinhVien}')">Chỉnh sửa</button>
                    <button class="btn btn-danger" onclick="xoaSinhVien('${sv.maSinhVien}')" >Xoá</button>
                </td>
            </tr>
        `
    }
    document.querySelector('#tblSinhVien').innerHTML = htmlString;
    return htmlString;
}