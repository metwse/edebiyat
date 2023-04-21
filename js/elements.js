//{{{ IcraatExam 
customElements.define('e-article', class extends HTMLElement {
    constructor() {
        super()
        this._checked = false
    }

    attach(article, opt) {
        this.innerHTML = `
            <h2><a href="javascript:app.redirect('/makale/${article.title.replace(/[^\w\d]/g, '-')}--${article.id}')">${article.title}</a></h2>
            <div class="details">
                <div class="author">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                    </svg>
                    <span class="value">${article.author}</span>
                </div>
                <div class="date">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar" viewBox="0 0 16 16">
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                    </svg>
                    <span class="value">${article.date}</span>
                </div>
            </div>
            <img src="/api/images/${article.id}">
            <div class="text">${article.HTML(opt?.maxLength)}</div>
        `
    }
})
//}}}

