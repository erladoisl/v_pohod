
const raskladki = [
    {
        id: 1,
        name: 'Ультралегкая(горная 3ка) 12 дней',
        edit_enable: true,
    },
    {
        id: 2,
        name: 'Сплав Песчаная 2022',
        edit_enable: false,
    },
    {
        id: 3,
        name: 'Ноябрьская единичка(6 дней)',
        edit_enable: true,
    },
    {
        id: 4,
        name: 'На два дня',
        edit_enable: true,
    },
    {
        id: 5,
        name: 'Летний велосипед',
        edit_enable: false,
    },
    {
        id: 6,
        name: 'Ноябрьская единичка(6 дней)',
        edit_enable: true,
    },
]

const Raskladki = (props) => {

    return (
        <div className="container">
            <section className="py-5 text-center container">
                <div className="row py-lg-5">
                    <div className="col-lg-6 col-md-8 mx-auto">
                        <h1 className="fw-light">Архив раскладок</h1>
                        <p className="lead text-muted">Помошник по созданию раскладок для походов и не только. Автоматический рассчет количества ингредиентов для участников, помощь при совместной закупке. Делает работу легче :)</p>
                        <p>
                            <a href="#" className="btn btn-primary m-2">Создать новую раскладку</a>
                            <a href="#" className="btn btn-secondary m-2">Создать на основе существующей</a>
                        </p>
                    </div>
                </div>
            </section>
            <div className="album py-5 bg-light">
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => {
                        return (
                            <div className="col" key={i}>
                                <div className="card shadow-sm">
                                    <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
                                        <title>Ультралегкая</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Ультралегкая{i}</text>
                                    </svg>

                                    <div className="card-body">
                                        <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-sm btn-outline-secondary">Посмотреть</button>
                                                <button type="button" className="btn btn-sm btn-outline-secondary">Отредактировать</button>
                                            </div>
                                            <small className="text-muted">9 дней</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>

    )
}

export default Raskladki