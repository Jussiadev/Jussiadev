$(function () {

    $('#btn').on('click', zz);

    var img1;
    function zz(){
        $('#allimg').html2canvas({
            onrendered : function(canvas) {
                img = canvas.toDataURL();
                document.getElementById("iii").src=img;
            }
        });

    };

    function Convert() {
        //По нажатию на кнопку получаем канвас
        var canvas = document.getElementById('myCanvas');
        // И создаем из него картиику в base64
        var quality = 1; // качество от 0 до 1, заодно и сжать можно
        var myImage = {
            data: canvas.toDataURL('image/jpeg', quality),
            height: canvas.height,
            width: canvas.width
        };
        // теперь из картинки делаем PDF
        createPDF(myImage);
    }

//image - должен иметь свойста height,width и data - хранит картинку в base64
    function createPDF(image) {
        let w = ConvertPxToMM(image.width);
        let h = ConvertPxToMM(image.height);
        var orientation = w > h ? 'l' : 'p';

        //Создаем документ PDF размером с нашу картинку
        var docPDF = new jsPDF(orientation, 'mm', [w, h]);
        //рисуем картинку на всю страницу
        docPDF.addImage(image.data, 'JPEG', 0, 0);

        //Сохраням полученный файл
        //Возможные значения : dataurl, datauristring, bloburl, blob, arraybuffer, ('save', filename)
        docPDF.output('save', 'test.pdf');
    }

    function ConvertPxToMM(pixels) {
        return Math.floor(pixels * 0.264583);
    }
});

