window.onload = function () {
    const blockBody = document.querySelector('#block-body');
    const loader = document.querySelector('#loader');
    const inputLength = document.querySelector('#filter-input-length');
    const inputLimit = document.querySelector('#filter-input-limit');
    const filterButton = document.querySelector('#filter-button');
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

    const onStart = (event) => {
        if (isLoading || !checkFormValidation()) {
            return;
        }

        isLoading = true;
        const result  = [];
        for (let i = 0; i < +inputLength.value; i++) {
            const obj = {
                index: i + 1,
                title: textList[Math.floor(Math.random() * (textList.length - 1))].slice(0, 200),
                text: textList[Math.floor(Math.random() * (textList.length - 1))],
            };
            result.push(obj);
        }

        event.target.classList.add('disabled-button');
        loader.classList.remove('hide-loader');
        blockBody.innerHTML = '';
        Promise.all(queue(result, mapper, +inputLimit.value)).then(data => {
            isLoading = false;
            const progress = document.createElement('p');
            progress.innerText = `Progress ${data.length} of ${inputLength.value}`;
            progress.classList.add('block-progress');
            blockBody.append(progress);
            data.forEach(textObj => {
                const article = document.createElement('article');
                const h3 = document.createElement('h3');
                const p = document.createElement('p');

                article.classList.add('block-item');
                h3.classList.add('block-item-title');
                p.classList.add('block-item-text');
                h3.innerText = textObj.title;
                p.innerText = textObj.text;
                blockBody.append(article);
                article.append(h3, p);
                h3.setAttribute('title', textObj.title);
            });
            event.target.classList.remove('disabled-button');
            loader.classList.add('hide-loader');
        });
    }

    initProject();

    function queue(arr, func, limit) {
        return func(arr, limit);
    }

    function mapper(arr, limit) {
        const result = [];
        for (let i = 0; i < limit; i++) {
            result.push(new Promise((resolve) => {
                setTimeout(() => resolve(arr[i]), Math.round(Math.random() * 9000) + 1000);
            }));
        }

        return result;
    }

// Returns true if forms are valid
    function checkFormValidation() {
        const length = +inputLength.value;
        const limit = +inputLimit.value;
        const isValid = length > 0 && limit > 0 && length >= limit;
        if (isValid) {
            filterButton.classList.remove('disabled-button');
        } else {
            filterButton.classList.add('disabled-button');
        }
        return isValid;
    }

    function initProject() {
        filterButton.addEventListener('click', onStart);
        inputLength.addEventListener('input', onInput);
        inputLimit.addEventListener('input', onInput);
    }
}
