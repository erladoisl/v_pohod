
const raskladki = [
    {
        id: 1,
        name: 'Ультралегкая(горная 3ка) 12 дней',
        description: 'Приэльбрусье 13-23 августа 2022. Руководитель Гайфутдинов Руслан. Участников 12',
        partisipant_count: 12,
        edit_enable: true,
    },
    {
        id: 2,
        name: 'Сплав Песчаная 2022',
        description: 'Приэльбрусье 13-23 августа 2022. Руководитель Гайфутдинов Руслан. Участников 12',
        partisipant_count: 12,
        edit_enable: false,
    },
    {
        id: 3,
        name: 'Ноябрьская единичка(6 дней)',
        description: 'Приэльбрусье 13-23 августа 2022. Руководитель Гайфутдинов Руслан. Участников 12',
        partisipant_count: 12,
        edit_enable: true,
    },
    {
        id: 4,
        name: 'На два дня',
        description: 'Приэльбрусье 13-23 августа 2022. Руководитель Гайфутдинов Руслан. Участников 12',
        partisipant_count: 12,
        edit_enable: true,
    },
    {
        id: 5,
        name: 'Летний велосипед',
        description: 'Приэльбрусье 13-23 августа 2022. Руководитель Гайфутдинов Руслан. Участников 12',
        partisipant_count: 12,
        edit_enable: false,
    },
    {
        id: 6,
        name: 'Ноябрьская единичка(6 дней)',
        description: 'Приэльбрусье 13-23 августа 2022. Руководитель Гайфутдинов Руслан. Участников 12',
        partisipant_count: 12,
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
            <div class="row row-cols-1 row-cols-md-3 mb-3 text-center">
                {raskladki.map((item) => {
                    return (
                        <div class="col" key={item.id}>
                            <div class="card mb-4 rounded-3 shadow-sm">
                                <div class="card-header py-3">
                                    <h4 class="my-0 fw-normal">{item.name}</h4>
                                </div>
                                <div class="card-body">
                                    <h1 class="card-title pricing-card-title">{item.partisipant_count}<small class="text-muted fw-light">человек</small></h1>
                                    <p class="text-center py-3">
                                        {item.description}
                                    </p>
                                    <button type="button" class="w-100 btn btn-lg btn-outline-primary">Просмотреть</button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Raskladki