window.onload = function () {
    const blockProgressElement = document.querySelector('#block-progress');
    const blockBodyElement = document.querySelector('#block-body');
    const loaderElement = document.querySelector('#loader');
    const inputLengthElement = document.querySelector('#filter-input-length');
    const inputLimitElement = document.querySelector('#filter-input-limit');
    const filterButtonElement = document.querySelector('#filter-button');
    let isLoading = false;

    const onInput = (event) => {
        if (event.target.value.trim().length) {
            event.target.nextElementSibling.classList.add('input-placeholder-small');
        } else {
            event.target.nextElementSibling.classList.remove('input-placeholder-small');
            event.target.value = '';
        }
        checkFormValidation();
    }

    const onStart = async (event) => {
        if (isLoading || !checkFormValidation()) {
            return;
        }

        const result  = [];
        const limit = +inputLimitElement.value;
        const length = +inputLengthElement.value;
        let arr = [];
        let progressCounter = 0;

        isLoading = true;
        event.target.classList.add('disabled-button');
        loaderElement.classList.remove('hide-loader');
        blockBodyElement.innerHTML = '';
        blockProgressElement.innerText = '';

        for (let i = 0; i < length; i++) {
            const article = document.createElement('article');
            const obj = {
                index: i + 1,
                title: `${i + 1}. ${textList[Math.floor(Math.random() * (textList.length - 1))].slice(0, 200)}`,
                text: textList[Math.floor(Math.random() * (textList.length - 1))],
            };

            result.push(obj);
            article.setAttribute('id', `block-item-${i + 1}`);
            blockBodyElement.append(article);
        }

        await Promise.all(queue(result, mapper).map(async promiseObj => {
            await promiseObj.then(data => {
                arr.push(data);
                if (arr.length === limit || length - progressCounter < limit) {
                    arr.forEach(textObj => {
                        const article = blockBodyElement.querySelector(`#block-item-${textObj.index}`);
                        const h3 = document.createElement('h3');
                        const p = document.createElement('p');

                        article.classList.add('block-item');
                        h3.classList.add('block-item-title');
                        p.classList.add('block-item-text');
                        h3.innerText = textObj.title;
                        p.innerText = textObj.text;
                        article.append(h3, p);
                        h3.setAttribute('title', textObj.title);
                        blockProgressElement.innerText =
                            `Progress ${++progressCounter} of ${length}`;
                    });

                    arr = [];
                }
            });
        }));

        isLoading = false;
        event.target.classList.remove('disabled-button');
        loaderElement.classList.add('hide-loader');
    }

    initProject();

    function queue(arr, func) {
        return func(arr);
    }

    function mapper(arr) {
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            result.push(new Promise((resolve) => {
                setTimeout(() => resolve(arr[i]), Math.round(Math.random() * 9000) + 1000);
            }));
        }

        return result;
    }

// Returns true if forms are valid
    function checkFormValidation() {
        const length = +inputLengthElement.value;
        const limit = +inputLimitElement.value;
        const isValid = length > 0 && limit > 0 && length >= limit;
        if (isValid) {
            filterButtonElement.classList.remove('disabled-button');
        } else {
            filterButtonElement.classList.add('disabled-button');
        }
        return isValid;
    }

    function initProject() {
        filterButtonElement.addEventListener('click', onStart);
        inputLengthElement.addEventListener('input', onInput);
        inputLimitElement.addEventListener('input', onInput);
    }
}
