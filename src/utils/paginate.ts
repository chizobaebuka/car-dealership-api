export const paginate = (model: any, query: any, options: any) => {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const queryObj = { ...query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    const countQuery = model.countDocuments(JSON.parse(queryStr));
    const dataQuery = model.find(JSON.parse(queryStr))
        .skip(skip)
        .limit(limit);

    if (options.sort) {
        const sortBy = options.sort.split(',').join(' ');
        dataQuery.sort(sortBy);
    } else {
        dataQuery.sort('-createdAt');
    }

    if (options.fields) {
        const fields = options.fields.split(',').join(' ');
        dataQuery.select(fields);
    }

    return Promise.all([countQuery, dataQuery]);
};