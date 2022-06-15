import newHike from '../../media/help/new_hike.gif'
import newDay from '../../media/help/new_day.gif'
import downloadExcel from '../../media/help/download_excel.gif'
import newEating from '../../media/help/new_eating.png'
import eatingFields from '../../media/help/eating_fields.png'
import ingredFields from '../../media/help/ingred_fields.png'
import newFood from '../../media/help/new_food.png'

const Help = (() => {
    return (
        <div className="help">
            <section className="pt-5 text-center container">
                <div className="row py-lg-5">
                    <div className="col-lg-6 col-md-8 mx-auto">
                        <h1 className="fw-light">С чего начать?</h1>
                        <div className="lead text-muted">Данное руководство наглядно продемонстрирует:
                            <div>Как создавать собственные походы.</div>
                            <div>Как добавлять раскладку с едой к походу.</div>
                            <div>Получать рассчеты по количеству еды на все приемы пищи и </div>
                            <div>общее количество ингредиентов для их покупки.</div>
                            <div>Результат можно увидеть на сайте или скачать в виде таблицы.</div>
                            <div>При возникновении сложностей, <b>пиши в telegram @rakhina</b></div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="col-lg-9 col-md-8 mx-auto"></hr>

            <div className='col-lg-9 col-md-8 mx-auto' >
                <div className="fs-4 text-start">1. Создание похода (Видео-инструкция 1)</div>
                <div className="fs-5 my-3 text-start text-muted">
                    Перейди на страницу "Походы", нажми на кнопку "Создать новый поход".
                    <div>В открывшейся странице заполни все поля и нажмите на "Сохранить".</div>
                </div>
                <img src={newHike} alt='new hike creating' className='col-12' />
                <div className='text-center col-12 fs-6'>(Видео-инструкция 1 - Создание похода)</div>
            </div>

            <br />

            <div className='col-lg-9 col-md-8 mx-auto' >
                <div className="fs-4 text-start">2. Добавление дней (Видео-инструкция 2)</div>
                <div className="fs-5 my-3 text-start text-muted">
                    Перейди на вкладку "Походы".
                    <div>Найди нужный поход и нажми на нем на кнопку "Посмотреть"</div>
                    <div>Для добавления дня на открывшейся странице нажмите на "+ день"</div>
                    <div>При каждом нажатии на "+" будет добавляться блоки с информацией о новых днях. </div>
                    <div>Можно корректировать дату дней при нажатии на нее</div>
                </div>
                <img src={newDay} alt='new hike creating' className='col-12' />
                <div className='text-center col-12 fs-6'>(Видео-инструкция 2 - Добавление дней)</div>
            </div>

            <br />

            <div className='col-10 mx-auto text-start' >
                <div className="fs-4">3. Добавление приемов пищи</div>
                <div className="fs-5 text-muted">
                    <div className='mx-5'>
                        <b>3.1.</b> Нажми на иконку "+" у надписи "прием пищи"(Рисунок 1)
                        <div>
                            <img src={newEating} alt="" />
                            <div className='text-center col-6 fs-6'>Рисунок 1 - Добавление приема пищи</div>
                        </div>
                        <hr className="my-4"></hr>
                        <div>
                            <b>3.2</b> Введи название приема пищи в поле "название"(Рисунок 2, пункт 1)
                        </div>
                        <div>
                            Выбери тип приема пищи(Рисунок 2, пункт 2): завтрак, обед, ужин...
                        </div>
                        <div>
                            <img src={eatingFields} alt="" />
                            <div className='text-center col-6 fs-6'>Рисунок 2 - Заполнение информации об приеме пищи и добавление ингредиентов</div>
                        </div>
                        <hr className="my-4"></hr>
                        <div>
                            <b>3.3.</b> Для добавления ингредиента в приеме пищи, нажки на "+" у надпиcи ингредиент(Рисунок 2, пункт 3).
                        </div>
                        <div>
                            <b>3.4.</b> После добавления ингредиента появится строка с информацией об ингредиенте(рис. 3)
                        </div>
                        <div>
                            <img src={ingredFields} alt="" />
                            <div className='text-center col-6 fs-6'>Рисунок 3 - Заполнение информации об ингредиенте</div>
                        </div>
                        <hr className="my-4"></hr>
                        <div>
                            <b>3.4.1.</b> Выбери нужный ингредиент из списка (Рисунок 3, пункт 1). Если нужного ингредиента нет, нужно его добавить(см. пункт 4. Добавление продукта в словарик)
                        </div>
                        <div>
                            <b>3.4.2.</b> Выбери формулу для рассчета количества игредиента(Рисунок 3, пункт 2). Это очень важный пункт, от правильного выполнения которого зависит правильность подсчета ингредиентов, что облегчает закупку продкутов и делает работу в целом легче. Подробное описание выбора формулы смотри в пункте 5.
                        </div>
                    </div>
                </div>
            </div>

            <br />

            <div className='col-10 mx-auto text-start' >
                <div className="fs-4">4. Добавление продукта в словарик</div>
                <div className="fs-5 text-muted">
                    <ul className='mx-3'>
                        Перейди на страницу "Словарики", прокрути вниз до таблицы: "Граммовка продуктов на человека(гр/чел или шт/чел):"
                        <div>
                            <img src={newFood} alt="" />
                            <div className='text-center fs-6'>Рисунок 4 - Добавление продукта в словарик</div>
                        </div>
                        Чтобы добавить продукт, нужно:
                        <li>Заполнить поле "Продукт"(Рисунок 4, пункт 1), оно должно быть уникальным</li>
                        <li>Следующее поле это необходимое количество продукта на одного человека(Рисунок 4, пункт 2). Можно пропустить это поле, если оно не влияет на вычисление.</li>
                        <li>Указать единицу измерения(Рисунок 4, пункт 3) и нажать на "Добавить"</li>
                    </ul>
                </div>
            </div>

            <br />

            <div className='col-10 mx-auto text-start' >
                <div className="fs-4">5. Правила выбора формулы для рассчета количества игредиентов</div>
                <div className="fs-5 text-muted">
                    <ul className='mx-3'>
                        <li>Выбирай "порция". Это самый распространенный способ вычисления, когда, например, овсянки на одного человека нужно 60 гр., то на прием пищи потребуется 60 * количество участников грамм</li>
                        <li>Если одной упаковки продукта хватает на двоих участиков похода, выбирай "1 шт. на 2 порции.</li>
                        <li>Если одной упаковки продукта хватает на весь поход, например, упаковка кетчупа, выбирай "1 шт. на поход.</li>
                        <li>Если ингредиента нужно в количестве 1 единицы на один прием пищи, например, банки сгущенки, выбирай "1шт. на прием пищи.</li>
                        <li>и т.д...</li>
                    </ul>
                </div>
            </div>

            <br />

            <div className='col-lg-10 mx-auto' >
                <div className="fs-4 text-start">6. Получение результата в виде таблицы</div>
                <div className="fs-5 m-3 text-start text-muted">
                    Для загрузки файла, нужно нажать на кнопку "Загрузить раскладку"
                </div>
                <div className='mx-3'>
                    <img src={downloadExcel} alt='new hike creating' className='col-12' />
                    <div className='text-center col-12 fs-6'>(Видео-инструкция 3 - Загрузка данных в виде excel)</div>
                </div>
            </div>
        </div>
    )
})

export default Help