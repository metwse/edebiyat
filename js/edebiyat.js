const url = { backend: '/api' }
function mdToHTML(raw) {
    var _ = /(([^<>]+)(?:((?=<[^>]*>[^\<]*<\/[^>]*>))|(<[^\/]*\/>))+|[^>]*$)/g;
    return raw ? raw.replace(/\</g, '&lt;').replace(/\>/g, '&gt;')
        .replace(/(https?)\:\/\/([\w\d\.\-ğüışöç]+)(?:\/([\w\d\.\-ğüşıöç\;\,\?\:\@\&\=\+\$\!\(\)\#\/\%]*))?/g, (raw, protocol, origin, pathname) => `<a class="href" href="${raw.replace(/\&lt;/g, '<')}" target="blank">${(origin + (pathname?.length ? '/' : '') + ((pathname?.length > 16 ? pathname.substring(0, 16) + '...' : pathname) || ''))}</a>`)
        .replace(_, text => text.replace(/([^\w\d]?)\@([\w\d-\.\/]+)/g, (_, text, name) => `${text}<a class="href" href="javascript:app.redirect('/@${name}')">@${name.replace(/\_/, '&#95')}</a><wbr/>`))
        .replace(_, text => text.replace(/ /g, '&nbsp;<wbr>').replace(/\_((?:(?!\_)[\s\S])+)\_/g, (raw, text) => `<u>${text}</u>`))
        .replace(/\*\*((?:(?!\*\*)[\s\S])+)\*\*/g, (raw, text) => `<b>${text}</b>`)
        .replace(/\*((?:(?!\*)[\s\S])+)\*/g, (raw, text) => `<i>${text}</i>`)
        .replace(/\~\~((?:(?!\~\~)[\s\S])+)\~\~/g, (raw, text) => `<del>${text}</del>`)
        .replace(/##((?:(?!##)[\s\S])+)##/g, (raw, text) => `<span class="rainbow">${text}</span>`)
        .replace(/\n/g, '<br>') : ''
}


class Session {
    constructor() {
        this.cache = {}
        this._articleCount
    }
    
    async request(path) {
        if (this.cache[path]) return this.cache[path]
        this.cache[path] = await fetch(url.backend + path).then(r => r.text())
        try { this.cache[path] = JSON.parse(this.cache[path]) } catch {}
        return this.cache[path]
    }

    async getArticle(id) {
        var data = (await this.request(`/articles/${id}`)).split('\n')
        const title = data.shift()
        const [author, date] = data.shift().split('#')
        return new Article({ id, title, author, date, text: data.join('\n')})
    }

    async getArticles(limit, offset) {
        const list = []
        for (let i = offset; i < limit + offset; i++) list.push(i)
        return await Promise.all(list.map(i => this.getArticle(i)))
    }

    get articleCount() {
        return this._articleCount ?? (async () => { const count = await this.request('/count'); this._articleCount = count; return count})() 
    }
}


class Article {
    constructor({ id, title, author, text, date }) {
        this.id = id, this.title = title
        this.author = author.replace('<', '&lt;'), this.text = text
        try { this.date = new Intl.DateTimeFormat(navigator.language, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date)) } catch { this.date = '?' }
    }

    HTML(length) {
        return mdToHTML(length ? this.text.substring(0, length) + (this.text.length > length ? '...' : '') : this.text.substring)
    }
}


window.edebiyat = { Session }
