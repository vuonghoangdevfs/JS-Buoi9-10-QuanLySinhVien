import { SinhVien } from "../models/SinhVien.js";
document.querySelector('#frmSinhVien').onsubmit = function (e) {
    e.preventDefault(); //ngăn reload trình duyệt
    console.log('submit')
    //input: sinhVien: object SinhVien
    let sv = new SinhVien();
    let arrInput = document.querySelectorAll('#frmSinhVien .form-control');
    for(let input of arrInput){
        let id = input.id;
        let value = input.value;
        sv[id] = value
    }
    console.log(sv);
    //output: htmlString `<tr> <td></td> `
    let htmlString = '';
    //process
    htmlString = `
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
                <button class="btn btn-primary mx-2">Chỉnh sửa</button>
                <button class="btn btn-danger" onclick="xoaSinhVien(this)" >Xoá</button>
            </td>
        </tr>
    `;
    //in output ra giao diện
    document.querySelector('#tblSinhVien').innerHTML += htmlString;
}

async function getAllSinhVienAsync() {
    const response = await fetch('https://svcy.myclass.vn/api/SinhVienApi/LayDanhSachSinhVien');
    const data = await response.json();
    console.log(data)
};
getAllSinhVienAsync();


async function insertSinhVienAsync(sinhVienOb) { //format sinh viên api
    const response = await fetch('https://svcy.myclass.vn/api/SinhVienApi/themSinhVien',{
        method:'POST',
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(sinhVienOb)
    });
    const data = await response.json();
    console.log(data);
}

let obCreate = {
    "maSinhVien": "5312",
    "tenSinhVien": "khải udpate",
    "loaiSinhVien": "string",
    "diemToan": 10,
    "diemLy": 10,
    "diemHoa": 10,
    "diemRenLuyen": 10,
    "email": "khai@gmail.com",
    "soDienThoai": "07070707"
  }

//   insertSinhVienAsync(obCreate);

async function updateSinhVienAsync (id,obUpdate){ 
    const response = await fetch(`https://svcy.myclass.vn/api/SinhVienApi/CapNhatThongTinSinhVien?maSinhVien=${id}`,{
        method:'PUT',
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(obUpdate)
    });
    const data = await response.json();
    console.log(data);
}
// let obUpdate = {...obCreate};
// obUpdate.tenSinhVien = 'AAAAA'
// updateSinhVienAsync(id,obUpdate)

async function deleteSinhVienAsync(id) {
    const response = await fetch(`https://svcy.myclass.vn/api/SinhVienApi/xoaSinhVien?maSinhVien=${id}`, {
        method:'DELETE'
    });

    const data = await response.json();
    console.log(data);

}

// deleteSinhVienAsync(16)