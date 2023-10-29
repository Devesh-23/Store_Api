const product = require('../models/product')

const getAllProductStatic = async (req, res) =>{    //this one is static to use that is we are giving the data to be searched hardcoded
    //const search = 'oo'

    const Products = await product.find({}).sort('-name price')
    res.status(200).json({ nbHits:Products.length, Products })
}

const getAllProducts = async (req, res) =>{
    // console.log(req.query)
    const { featured, company, name, sort, fields, NumericFilter } = req.query
    const quertObj = {}; 
    if(featured){
        quertObj.featured = featured === 'true'?true:false;
    }

    if(company){
        quertObj.company = company
    }

    if(name){
        quertObj.name  = {$regex:name, $options:'i'}
    }


    if(NumericFilter){
        const operatorMap ={
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'$lte',
        }
        // console.log(NumericFilter)

        const regex = /\b(<|>|>=|=|<|<=)\b/g
        
        let filters = NumericFilter.replace(regex, (match) =>`-${operatorMap[match]}-`)

        const options = ['price', 'rating']
        filters = filters.split(',').forEach((item)=>{
            const [field, operator, value] = item.split('-')
            if(options.includes(field)){
                quertObj[field] ={[operator]:Number(value)}
            }
        })


        // console.log(filter)
    }

    // console.log(quertObj)
    let result =  product.find(quertObj)

    //sort
    if(sort){
        const spaceList = sort.split(',').join(' ')
        result = result.sort(spaceList)
        //console.log(sort)
    }else{
        result = result.sort('createdAt')
    }


    //select the particular fields
    if(fields){
        const fieldList = fields.split(',').join(' ')
        result = result.select(fieldList)
    } 
    
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10 
    const skip = (page-1)*limit

    result = result.skip(skip).limit(limit)


    const Products = await result
    res.status(200).json({nbHits:Products.length, Products })
}


module.exports ={
    getAllProductStatic,
    getAllProducts
}