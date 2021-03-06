const Tour = require('../models/tourModel');
//const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))
const APIFeatures = require('../utils/apiFeatures')
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratigsAverage,summary,difficulty'
  next()
}

exports.getAllTours = async (req, res) => {
  try {
    //build the query
    //1A)filtering


    // const queryObj = { ...req.query }
    // const excludedFields = ['page', 'sort', 'limit', 'fields']
    // excludedFields.forEach(el => delete queryObj[el])

    // //1B)advanced filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)


    // let query = Tour.find(JSON.parse(queryStr))

    // console.log(queryObj, req.query, JSON.parse(queryStr))
    // const tours = await Tour.find()
    // .where('duration')
    // .equals(5)
    // .where('difficulty')
    // .equals('easy');

    //2) Sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(",").join(" ");

    //   query = query.sort(sortBy)
    // }
    // else {
    //   query = query.sort('-createdAt')
    // }

    //3) filed limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields)
    // }
    // else {
    //   query = query.select('-__v');
    // }
    //4) pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 2;
    // const skip = (page - 1) * limit

    // query = query.skip(skip).limit(limit)

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments()
    //   if (skip >= numTours) throw new Error('this page doesnt exist')
    // }
    //execute query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query

    res.status(200).json({
      status: 'success',
      time: req.requestTime,
      results: tours.length,
      data: {
        tours
      }
    })
  }
  catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }

}

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    //Tour.findOne({_id:req.params.id})
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  }
  catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }


}

exports.createTour = async (req, res) => {
  try {
    // const newTour = newTour({})
    // newTour.save()
    const tour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour
      }
    })
  }
  catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
}

exports.updateTour = async (req, res) => {
  try {
    console.log(req.params.id, req.body)
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  }
  catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }

}

exports.deleteTour = async (req, res) => {
  try {

    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
    })
  }
  catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
}

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: '$difficulty',
          numTour: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },

        }
      },
      { $sort: { avgPrice: 1 } }

    ])

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    })
  }
  catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
}