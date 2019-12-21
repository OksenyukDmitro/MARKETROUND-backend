import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter a category'],
        },

    },
    { timestamps: true },
);

CategorySchema.statics.findByQuery = function findByQuery(query) {
    return this.find(query)
};
CategorySchema.statics.findOneByQuery = function findByQuery(query) {
    return this.findOne(query)
};


const CategoryModel = mongoose.model('Category', CategorySchema);

export default CategoryModel;