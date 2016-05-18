import _ from 'lodash';

const afterFetchTransformers = [];
const beforeSaveTransformers = [];
module.exports = function registerTransformer({ afterFetch, beforeSave }) {
  if(afterFetch) {
    afterFetchTransformers.push(afterFetch);
  }
  if(beforeSave) {
    beforeSaveTransformers.push(beforeSave);
  }
}

function isAccount(obj) {
  return typeof obj === 'object' && (obj.data || obj.profile);
}

try {
  // Serialize data coming from Gigya.
  const handleSpecialFields = gigya._.handleSpecialFields;
  gigya._.handleSpecialFields = function(obj) {
    try {
      if(isAccount(obj)) {
        _.each(afterFetchTransformers, (afterFetch) => {
          afterFetch(obj);
        });
      }
    } catch(e) {
      if(typeof console === 'object' && console.log) {
        console.log('Error with Gigya afterFetch transformer.', obj, e);
      }
    }
    return handleSpecialFields.apply(this, arguments);
  }

  // Serialize data going into Gigya.
  const filterParams = gigya._.ServerApiRequest.prototype.filterParams;
  gigya._.ServerApiRequest.prototype.filterParams = function() {
    try {
      if(isAccount(this.params)) {
        _.each(beforeSaveTransformers, (beforeSave) => {
          beforeSave(this.params);
        });
      }
    } catch(e) {
      if(typeof console === 'object' && console.log) {
        console.log('Error with Gigya beforeSave transformer.', this.params, e);
      }
    }
    return filterParams.apply(this, arguments);
  }
} catch(e) {
  if(typeof console === 'object' && console.log) {
    console.log('Error registering Gigya transformers.', e);
  }
}