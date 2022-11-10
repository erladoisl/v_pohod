import EatingCategories from "./EatingCategories/EatingCategories";
import Food from "./Food/Food";
import Formula from "./Formula/Formula";


const Dictionary = (() => {
    return (
        <div className="container">
            <section className="pt-5 text-center container">
                <div className="row py-lg-5">
                    <div className="col-lg-6 col-md-8 mx-auto">
                        <h1 className="fw-light">Словарики</h1>
                        <div className="lead text-muted">На этой странице можно добавлять:
                            <div>Типы приемов пищи: завтрак, перекус, обед...</div>
                            <div>Продукты и норму продуктов на человека</div>
                            <div>Формулы для вычисления объема продуктов</div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="row">
                <EatingCategories />
                <Food />
                <Formula />
            </div>
        </div>
    );
});


export default Dictionary;