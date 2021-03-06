const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Types = Schema.Types;
const Model = mongoose.model;

function LModel(options) {
	let imgObjDescription = {
		//s3 file name
		s3_file: String,
		//s3 etag
		etag: String,
		//s3 size
		size: Number,

		//image properties
		width: Number,
		height: Number,
	};

	let refImgObjDescription = Object.assign({}, imgObjDescription, {
		//hash of modifications Object
		hash: String,
		//list of modifications
		modifications: Object,
		//format
		format: String,
	});

	let childRefImgObjDescription = Object.assign({}, refImgObjDescription, {
		//live till ts
		ttl: {type: Number, default: 0}
	});

	let modelSchema = new Schema(
		{
			domain: String,
			format: String,

			//user defined path
			path: String,
			path_array: [String],

			//s3 path to folder
			s3_folder: String,

			/* can't modify this image */
			original: imgObjDescription,

			/* global modification, color/watermark etc... */
			reference: refImgObjDescription,

			/* local modifications of ref, made by URL. For example resize 50x50 */
			refChildren: [childRefImgObjDescription],

			/* mark as deleted for cron to delete image */
			deleted: { type: Boolean, default: false}
		},
		{
			timestamps: true,
		},
	);

	modelSchema.index(
		{
			domain: 1,
			path: 1,
		},
		{
			unique: true,
		},
	);

	let Image = Model('Image', modelSchema);

	return { Image };
}

module.exports = LModel;
