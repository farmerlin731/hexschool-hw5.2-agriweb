const showList = document.getElementById('show-list');
const btnChangeClass = document.getElementById('button-group');
const btnSearch = document.getElementById('searchBtn');
const cropInput = document.getElementById('crop');
const filterTxt = document.getElementById('js-crop-name');
const sortSelect = document.getElementById('js-select');
const sortRuleLine = document.querySelectorAll('.sort-advanced');
const colorUpCaret = document.querySelectorAll('.fa-caret-up');
const colorDownCaret = document.querySelectorAll('.fa-caret-down');

let oriDataList = [];
let filterDataList = [];
let sortRule = -1; // -1:default(no rule), 0:上價, 1:中價...etc
let ascending = false; // true:ascending , fales:descending

getData();

// 分類列的click action
sortRuleLine.forEach(item => {
    item.addEventListener('click', e => {
        if (e.target.dataset.index) {
            // for display
            if(sortRule == e.target.dataset.index){
                // No index changed.
                ascending = !ascending;
            }else{
                ascending = true;
            }
            sortRule = e.target.dataset.index;
            sortSelect.value = sortRule;
            setIndexColor();

            // for data sorting
            arrSort(filterDataList, sortRule, ascending?'up':'down');
            render(filterDataList);
        }
    });
});

// 品種切換按鈕的click action
btnChangeClass.addEventListener('click', function (e) {

    if (e.target.nodeName != 'BUTTON') {
        return;
    }

    let datatype = e.target.getAttribute('data-type');
    filterDataList = oriDataList.filter(function (item) {
        return item['種類代碼'] === datatype;
    });

    cleanTxt();
    cleanBtnActive();
    e.target.classList.add('active');
    arrSort(filterDataList, sortRule, ascending?'up':'down');
    render(filterDataList);

});

// 搜尋的click action
btnSearch.addEventListener('click', (e) => {
    e.preventDefault();

    let tmpName = cropInput.value.trim();
    if (tmpName == '') {
        return;
    }

    filterDataList = oriDataList.filter(item => item['作物名稱'].includes(tmpName));
    filterTxt.textContent = `以下為『${tmpName}』的搜尋結果：`;
    cropInput.value = '';
    cleanBtnActive()
    arrSort(filterDataList, sortRule, ascending?'up':'down');
    render(filterDataList);
});

//分類的select function
sortSelect.addEventListener('change', e => {
    sortRule = e.target.value;
    ascending = true;
    setIndexColor();
    arrSort(filterDataList, sortRule, 'up');
    render(filterDataList);
})

//初始撈資料
function getData() {
    axios.get('https://hexschool.github.io/js-filter-data/data.json').
        then(function (response) {
            // Delete the null-value data.
            oriDataList = response.data.filter(item => item['作物名稱']);
            filterDataList = [...oriDataList];
            render(oriDataList);
        });
}

//畫面渲染
function render(dataList) {
    let str = '';
    dataList.forEach(item => {
        str += `<tr>
        <td>${item['作物名稱']}</td>
        <td>${item['市場名稱']}</td>
        <td>${item['上價']}</td>
        <td>${item['中價']}</td>
        <td>${item['下價']}</td>
        <td>${item['平均價']}</td>
        <td>${item['交易量']}</td>
      </tr>`
    });

    showList.innerHTML = str.length == 0 ? '沒搜尋到任何結果。' : str;
}

//function for sorting data
function arrSort(dataList, tmpRule, direction) {
    console.log(`sortregion- index:${tmpRule}, direction:${direction}`);
    let tmpStr ;
    switch (tmpRule) {
        case '0':
            tmpStr = '上價';
            break;
        case '1':
            tmpStr = '中價';
            break;
        case '2':
            tmpStr = '下價';
            break;
        case '3':
            tmpStr = '平均價';
            break;
        case '4':
            tmpStr = '交易量';
            break;
    }
    dataList.sort(function (a, b) {
        return direction == 'up' ? a[tmpStr] - b[tmpStr] : b[tmpStr] - a[tmpStr];
    });
}

//改變分類列的顏色
function setIndexColor() {
    // Reset.
    sortRuleLine.forEach(item => {
        item.classList.remove('red');
    });
    colorUpCaret.forEach(item => {
        item.classList.remove('black');
    }); 
    colorDownCaret.forEach(item => {
        item.classList.remove('black');
    });

    // Set pointed-item red.
    sortRuleLine[sortRule].classList.add('red');
    if(ascending){
        colorDownCaret[sortRule].classList.add('black');
    }else{
        colorUpCaret[sortRule].classList.add('black');

    }
}

//清除所有文字
function cleanTxt() {
    cropInput.value = '';
    filterTxt.textContent = '';
}

//還原button外觀
function cleanBtnActive() {
    let btnTmp = document.querySelectorAll('#button-group button');
    btnTmp.forEach(item => {
        item.classList.remove('active');
    });
}