import * as tf from '@tensorflow/tfjs-node';

export const preprocessImage = (imageBuffer) => {
  const tensor = tf.node.decodeImage(imageBuffer)
    .resizeNearestNeighbor([224, 224])
    .expandDims(0)
    .toFloat();

  return tensor;
};