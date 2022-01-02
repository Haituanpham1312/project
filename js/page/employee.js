$(document).ready(function() {
    loadData();
    // Load dữ liệu cho các combobox:
    // Load dữ liệu phòng ban:
    loadDepartmentComboboxData();
    // Thực hiện gán các evens cho các element
    $('#btnAddEmployee').click(function() {
        // Hiển thị form chi tiết nhân viên:
        $("#dlgPopup").show();
        // Reset form: (xóa tất cả dữ liệu cũ đã nhập)
        $("input").val(null);
        // Lấy mã nhân viên mới và hiển thị lên ô nhập mã nhân viên:
        $.ajax({
            type: "GET",
            url: "http://cukcuk.manhnv.net/api/v1/Employees/NewEmployeeCode",
            success: function(response) {
                $('#txtEmployeeCode').val(response);
                // Focus vào ô nhập liệu đầu tiên:
                $('#txtEmployeeCode').focus()
            }
        });

    })

    $("#btnSave").click(function() {
        // Thu thập các thông tin đã liệu:
        const employeeCode = $('#txtEmployeeCode').val();
        const fullName = $('#txtFullName').val();
        const dateOfBirh = $('#dtDateOfBirth').val();
        const gender = $('#cbxGender').data('value');
        const address = $('#txtAddress').val();
        const email = $('#txtEmail').val();
        const phoneNumber = $('#txtPhoneNumber').val();
        const departmentId = $('#cbxDepartment').data('value');
        const salary = $('#txtSalary').val();

        // Build thành object nhân viên:
        let employee = {
            "EmployeeCode": employeeCode,
            "FullName": fullName,
            "Gender": gender,
            "DateOfBirth": dateOfBirh,
            "PhoneNumber": phoneNumber,
            "Email": email,
            "Address": address,
            "Salary": salary,
            "DepartmentId": departmentId
        }
        debugger
        console.log(employee);
        // Sử dụng ajax Gọi lên Api cất dữ liệu:
        $.ajax({
            type: "POST",
            url: "http://cukcuk.manhnv.net/api/v1/Employees",
            data: JSON.stringify(employee),
            dataType: "json",
            async: false,
            contentType: "application/json",
            success: function(response) {
                console.log(response);
            },
            error: function(res) {
                debugger
                console.log(res);
            }
        });
        // Ẩn form chi tiết:
        $("#dlgPopup").hide();
        // Load lại dữ liệu:
        loadData();
    })

    $('#btnCloseDialog').click(function() {
        $("#dlgPopup").hide();
    })
    $('#btnCancel').click(function() {
        $("#dlgPopup").hide();
    })
})

/**
 * Load dữ liệu cho combobox phòng ban
 * CreatedBy: NVMANH (12/11/2021)
 */
function loadDepartmentComboboxData() {
    // Lấy dữ liệu về:
    $.ajax({
        type: "GET",
        url: "http://cukcuk.manhnv.net/api/v1/Departments",
        success: function(response) {
            // Build combobox:
            debugger
            for (const department of response) {
                // let optionHTML = `<option value="${department.DepartmentId}">${department.DepartmentName}</option>`;
                let optionHTML = `<div class="m-combobox-item" value="${department.DepartmentId}">${department.DepartmentName}</div>`;

                $('#cbxDepartment .m-combobox-data').append(optionHTML);
                let itemDataElements = $('#cbxDepartment').find('.m-combobox-data').html();
                $('#cbxDepartment').data("itemDataElement", itemDataElements);
            }
        }
    });
}

async function loadData() {
    // Làm trống dữ liệu hiển thị trên table:
    $('tbody').empty();
    // Lấy dữ liệu về:
    let employees = [];
    // Sử dụng fetch trong js:
    // await fetch('http://cukcuk.manhnv.net/api/v1/Employees')
    //     .then(res => {
    //         debugger
    //         return res.json()
    //     })
    //     .then(data => {
    //         employees = data;
    //         console.log(data);
    //     })
    //     .catch(res => {});
    // sử dụng ajax:
    $.ajax({
        type: "GET", // GET - lấy dữ liệu; POST - Thêm mới; PUT - sửa; DELETE - xóa
        url: "http://cukcuk.manhnv.net/api/v1/Employees",
        // data: "json", // Tham số truyền lên cho Api (nếu có)
        async: false,
        dataType: "json",
        success: function(response) {
            employees = response;
            console.log("2")
        },
        error: function(res) {
            console.log("Lỗi Api");
        }
    });
    console.log("3");
    // do something with myJson
    // Xử lý dữ liệu:

    // Build dữ liệu hiển thị lên table:


    // Mapping từng thông tin của từng đối tượng trong mảng vào chuỗi HTML:
    for (const emp of employees) {
        // Xử lý dữ liệu:
        //1. Xử lý dữ liệu ngày tháng (phải hiển thị dạng Ngày/Tháng/Năm)
        let dateOfBirth = new Date(emp.DateOfBirth);
        let date = dateOfBirth.getDate();
        let month = dateOfBirth.getMonth() + 1;
        let year = dateOfBirth.getFullYear();
        // Bổ sung thêm ký tự '0' nếu ngày hoặc tháng nhỏ hơn 10
        date = (date < 10 ? `0${date}` : date);
        month = (month < 10 ? `0${month}` : month);
        dateOfBirth = `${date}/${month}/${year}`;

        // 2. Định dạng tiền tệ: (có dấu chấm phân cách hàng nghìn:)
        // let salary = (emp.Salary).toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
        let salary = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(emp.Salary);

        // Xác định các thông tin được thể hiện ở dạng HTML như thế nào?:
        let trHTML = `<tr>
                <td class="text-align-left">${emp.EmployeeCode}</td>
                <td class="text-align-left">${emp.FullName}</td>
                <td class="text-align-left">${emp.GenderName||""}</td>
                <td class="text-align-center">${dateOfBirth}</td>
                <td class="text-align-left">${emp.DepartmentName}</td>
                <td class="text-align-right">${salary}</td>
              </tr>`;
        $('tbody').append(trHTML);
    }
    console.log("4");
}

// JS object
var obj = {
    EmployeeCode: "NV001",
    FullName: "Nguyễn Văn Mạnh",
    Gender: undefined,
    "GetName": function() {

    },
    DOB: new Date()
}


// JSON Object:
var jsonObject = {
    "EmployeeCode": "NV-001",
    "FullName": "Lê Thị Mai 1",
    "Gender": 1,
    "DateOfBirth": "2021-11-02T00:00:00",
    "PhoneNumber": "0963855755",
    "Email": "mai@gmail.com",
    "Address": null,
    "Salary": 12000000,
    "GenderName": "Nam",
    "Gender": undefined,
    "GetName": function() {

    }
}