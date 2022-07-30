const Coffee = require('./model');
const { successfulRes, failedRes } = require('../../utils/response');

exports.getAllCoffee = async (req, res) => {
  const { page = 1 } = req.query;
  try {
    const skip = (page - 1) * 100;
    const response = await Coffee.findAll({
      offset: skip,
      limit: 100,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['deletedAt', 'updatedAt'] },
    });
    const count = await Coffee.count();

    return successfulRes(res, 200, { current_data: response, page_info: { count, skip, limit: 100 } });
  } catch (err) {
    return failedRes(res, 500, err);
  }
};

exports.getOneCoffee = async (req, res) => {
  const id = req.params.id;
  try {
    const response = await Coffee.findByPk(id, { attributes: { exclude: ['deletedAt', 'updatedAt'] } });

    return successfulRes(res, 200, response);
  } catch (err) {
    return failedRes(res, 500, err);
  }
};

exports.createCoffe = async (req, res) => {
  const { beverage_category, beverage, beverage_prep, calories, total_fat, caffeine, photo } = req.body;
  try {
    const response = await Coffee.create({
      beverage_category,
      beverage,
      beverage_prep,
      calories,
      total_fat,
      caffeine,
      photo,
    });

    return successfulRes(res, 201, { query: 'Query OK, 1 rows affected', record: response });
  } catch (err) {
    return failedRes(res, 500, err);
  }
};

exports.updateCoffee = async (req, res) => {
  const id = req.params.id;
  const { beverage_category, beverage, beverage_prep, calories, total_fat, caffeine, photo } = req.body;
  try {
    let response = await Coffee.findOne({ where: { id } });
    if (!response) {
      response = await Coffee.build();
    }
    response.beverage_category = beverage_category ? beverage_category : response.beverage_category;
    response.beverage = beverage ? beverage : response.beverage;
    response.beverage_prep = beverage_prep ? beverage_prep : response.beverage_prep;
    response.calories = calories ? calories : response.calories;
    response.total_fat = total_fat ? total_fat : response.total_fat;
    response.caffeine = caffeine ? caffeine : response.caffeine;
    response.photo = photo ? photo : response.photo;

    await response.save();
    return successfulRes(res, 200, response);
  } catch (err) {
    return failedRes(res, 500, err);
  }
};

exports.deleteCoffee = async (req, res) => {
  const id = req.params.id;
  const force = req.query.force;
  try {
    if (force) {
      const doc = await Coffee.destroy({ where: { id }, force: true });
      response = { message: `Coffee [${doc} rows affected] has been deleted successfully with --FORCE Option` };
    } else {
      const doc = await Coffee.destroy({ where: { id } });

      doc
        ? (response = { message: `Coffee [${doc} rows affected] has been deleted successfully --SOFTLY` })
        : (response = { message: `Query OK, ${doc} rows affected` });
    }
    return successfulRes(res, 200, response);
  } catch (err) {
    return failedRes(res, 500, err);
  }
};
