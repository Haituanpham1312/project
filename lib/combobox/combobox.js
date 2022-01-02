$(document).ready(function() {
    // Khởi tạo sự kiện cho button của combobox:
    $('.mcombobox .m-combobox-button').click(btnComboboxOnClick);

    // $('.mcombobox .m-combobox-item').click(itemComboboxOnClick);
    $('.mcombobox').on('click', '.m-combobox-item', itemComboboxOnClick);

    $(".mcombobox input").keypress(function(e) {
        console.log("keypress")
    });

    $(".mcombobox input").keydown(inputComboboxOnKeyDown);

    $(".mcombobox input").keyup(inputComboboxOnKeyUp);

    // Lưu trữ thông tin combobox data:
    let comboboxs = $('.mcombobox');
    for (const combobox of comboboxs) {
        let itemDataElements = $(combobox).find('.m-combobox-data').html();
        $(combobox).data("itemDataElement", itemDataElements);
        $(combobox).find('.m-combobox-data').empty();
    }

})

function inputComboboxOnKeyUp() {
    debugger
    // Loại bỏ một số phím đặc biệt:
    switch (event.keyCode) {
        case 13:
        case 40:
        case 38:
            break;
        default:
            $(this).siblings('.m-combobox-data').empty();
            let itemDataElement = $(this.parentElement).data('itemDataElement');

            // Build html cho các combobox data item:
            $(this).siblings('.m-combobox-data').html(itemDataElement);

            // Thực hiện lọc dữ liệu trong combobox data item:
            // 1. Lấy value đã nhập trên input:
            const valueInput = this.value;
            // 2. Duyệt từng item và thực hiện kiểm tra xem element nào có text trùng với value đã nhâp:
            // Lấy tất cả item element của combobox:
            let items = $(this).siblings('.m-combobox-data').children();
            //let items = $(this.parentElement).data('itemDataElement')
            for (const item of items) {
                debugger
                let text = item.textContent;
                if (!text.toLowerCase().includes(valueInput.toLowerCase())) {
                    item.remove();
                }
                debugger
            }
            $(this).siblings('.m-combobox-data').show();
            break;
    }

}

function inputComboboxOnKeyDown() {
    // Lấy tất cả item element của combobox:
    let items = $(this).siblings('.m-combobox-data').children();

    // Kiểm tra xem có item nào đã ở trạng thái được hover chưa:
    let itemHoverred = items.filter('.m-combobox-item-hover');
    // Bỏ hover tất cả những item đã được set trước đó:
    // $(items).removeClass("m-combobox-item-hover");


    switch (event.keyCode) {
        case 13: // Khi nhấn phím Enter:
            // Nếu có item nào được chọn thì lấy text -> gán cho input và value -> gán cho combobox:
            if (itemHoverred.length == 1) {
                // Lấy HTML element:
                itemHoverred = itemHoverred[0];
                let text = itemHoverred.textContent;
                let value = itemHoverred.getAttribute('value');

                // 3 - gán text vào input của combobox:
                // 3.1 - lấy ra element cha:
                let parentElement = itemHoverred.parentElement;
                // 3.2 - Tìm element input ngang cấp với element cha và thực hiện gán text:
                $(parentElement).siblings('input').val(text);
                $(itemHoverred).siblings('input').val(text);

                //4 . Gán value cho combobox:
                // 4.1  Tìm element mcombobox chứa item hiện tại:
                let parentComboboxElement = $(itemHoverred).parents('.mcombobox');

                // cách 1 - thực hiện lưu value vào attribute của element:
                parentComboboxElement.attr('value', value);
                // cách 2 - gán vào data của element:
                parentComboboxElement.data('value', value);

                debugger
                // Ẩn combobox data đi:
                $(parentElement).hide();
            }
            break;
        case 40: // Nhấn phím mũi tên xuống trên bàn phím
            // Nếu đã có item được hover trước đó thì hover tới item kế tiếp:
            if (itemHoverred.length > 0) {
                // Lấy element kế tiếp:
                let nextElement = itemHoverred.next();
                // Thêm class hover cho item kế tiếp:
                nextElement.addClass('m-combobox-item-hover');
                // Xóa class hover của item hiện tại:
                itemHoverred.removeClass('m-combobox-item-hover');
            } else {
                // Nếu chưa item nào được hover thì mặc định focus vào item đầu tiên trong data của combobox:
                // Chọn item đầu tiên:
                let firstItem = items[0];
                firstItem.classList.add('m-combobox-item-hover');
            }
            // Hiển thị data của combobox hiện tại:
            $(this).siblings('.m-combobox-data').show();
            break;
        case 38: // Nhấn phím mũi tên lên trên bàn phím
            // Nếu đã có item được hover trước đó thì hover tới item kế tiếp:
            if (itemHoverred.length > 0) {
                // Lấy element trước đó:
                let prevElement = itemHoverred.prev();
                // Thêm class hover cho item kế tiếp:
                prevElement.addClass('m-combobox-item-hover');
                // Xóa class hover của item hiện tại:
                itemHoverred.removeClass('m-combobox-item-hover');
            } else {
                // Mặc định focus vào item cuối cùng trong data của combobox:
                // Chọn item cuối cùng:
                let lastItem = items[items.length - 1];
                lastItem.classList.add('m-combobox-item-hover');
            }
            // Hiển thị data của combobox hiện tại:
            $(this).siblings('.m-combobox-data').show();
            break;
        default:

            break;
    }

}

function btnComboboxOnClick() {
    // Hiển thị combobox data của chính combobox hiện tại:
    // 1 - xác định combobox- data của combobox hiện tại:
    let comboboxData = $(this).siblings('.m-combobox-data');
    // 2 - hiển thị
    comboboxData.toggle();
}

function itemComboboxOnClick() {
    // Hiển thị text ở item vừa chọn lên input của comboboxbox:
    // 1 - Lấy text trong item vừa chọn:
    const text = this.textContent;

    // 2-  Lấy ra value của item vừa chọn:
    const value = this.getAttribute('value');

    // 3 - gán text vào input của combobox:
    // 3.1 - lấy ra element cha:
    let parentElement = this.parentElement;
    // 3.2 - Tìm element input ngang cấp với element cha và thực hiện gán text:
    $(parentElement).siblings('input').val(text);
    $(this).siblings('input').val(text);

    //4 . Gán value cho combobox:
    // 4.1  Tìm element mcombobox chứa item hiện tại:
    let parentComboboxElement = $(this).parents('.mcombobox');

    // cách 1 - thực hiện lưu value vào attribute của element:
    parentComboboxElement.attr('value', value);
    // cách 2 - gán vào data của element:
    parentComboboxElement.data('value', value);

    // Ẩn combobox data đi:
    $(parentElement).hide();
}