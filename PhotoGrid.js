import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import _ from 'lodash';
import ImageLoad from 'react-native-image-placeholder';

const {width} = Dimensions.get('window');

class PhotoGrid extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      width: props.width,
      height: props.height,
    };
  }

  static defaultProps = {
    numberImagesToShow: 0,
    onPressImage: () => {},
  };

  isLastImage = (index, secondViewImages) => {
    const {source, numberImagesToShow} = this.props;

    return (
        (source.length > 5 || numberImagesToShow) &&
        index === secondViewImages.length - 1
    );
  };

  handlePressImage = (event, {image, index}, secondViewImages) =>
      this.props.onPressImage(event, image, {
        isLastImage: index && this.isLastImage(index, secondViewImages),
      });

  static renderLast(img, height, width, imgStyle, textStyle, numPhotos) {
    return (
        <ImageBackground
            style={[styles.image, {width, height}, imgStyle, ]}
            source={typeof img === 'string' ? {uri: img} : img}>
          <View style={styles.lastWrapper}>
            <Text style={[styles.textCount, textStyle]}>
              + {numPhotos}
            </Text>
          </View>
        </ImageBackground>
    );
  }

  static renderItem(img, height, width, style, imgProps) {
    return (
        <ImageLoad
            style={[styles.image, {width, height}, style]}
            source={typeof img === 'string' ? {uri: img} : img}
            {...imgProps}
        />
    );
  }


  render() {
    const {imageProps, renderItem, renderLast} = this.props;
    const source = _.take(this.props.source, 5);
    const firstViewImages = [];
    const secondViewImages = [];
    const firstItemCount = source.length === 5 ? 2 : 1;
    let index = 0;
    _.each(source, (img, callback) => {
      if (index === 0) {
        firstViewImages.push(img);
      } else if (index === 1 && firstItemCount === 2) {
        firstViewImages.push(img);
      } else {
        secondViewImages.push(img);
      }
      index++;
    });

    const {width, height} = this.props;
    let ratio = 0;
    if (secondViewImages.length === 0) {
      ratio = 0;
    } else if (secondViewImages.length === 1) {
      ratio = 1 / 2;
    } else {
      ratio = this.props.ratio;
    }
    const direction = source.length === 5 ? 'row' : 'column';

    const firstImageWidth =
        direction === 'column'
            ? width / firstViewImages.length
            : width * (1 - ratio);
    const firstImageHeight =
        direction === 'column'
            ? height * (1 - ratio)
            : height / firstViewImages.length;

    const secondImageWidth =
        direction === 'column' ? width / secondViewImages.length : width * ratio;
    const secondImageHeight =
        direction === 'column'
            ? height / secondViewImages.length
            : height * ratio;

    const secondViewWidth = direction === 'column' ? width : width * ratio;
    const secondViewHeight = direction === 'column' ? height * ratio : height;

    return source.length ? (
        <View
            style={[{flexDirection: direction, width, height}, this.props.styles]}>
          <View
              style={{
                flex: 1,
                flexDirection: direction === 'row' ? 'column' : 'row',
              }}>
            {firstViewImages.map((image, index) => (
                <TouchableOpacity
                    activeOpacity={0.7}
                    key={index}
                    style={{flex: 1}}
                    onPress={event => this.handlePressImage(event, {image})}>
                  {renderItem(image, firstImageHeight, firstImageWidth, imageProps)}
                </TouchableOpacity>
            ))}
          </View>
          {secondViewImages.length ? (
              <View
                  style={{
                    width: secondViewWidth,
                    height: secondViewHeight,
                    flexDirection: direction === 'row' ? 'column' : 'row',
                  }}>
                {secondViewImages.map((image, index) => (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        key={index}
                        style={{flex: 1}}
                        onPress={event =>
                            this.handlePressImage(event, {image, index}, secondViewImages)
                        }>
                      {this.isLastImage(index, secondViewImages) ? (
                          renderLast(image, secondImageHeight, secondImageWidth, this.props.imageStyle, this.props.textStyles, this.props.numberImagesToShow || this.props.source.length - 5)
                      ) : (
                          renderItem(
                              image,
                              secondImageHeight,
                              secondImageWidth,
                              this.props.imageStyle,
                              imageProps,
                          )
                      )}
                    </TouchableOpacity>
                ))}
              </View>
          ) : null}
        </View>
    ) : null;
  }
}

PhotoGrid.prototypes = {
  source: PropTypes.array.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  style: PropTypes.object,
  imageStyle: PropTypes.object,
  onPressImage: PropTypes.func,
  ratio: PropTypes.float,
  imageProps: PropTypes.object,
  renderItem: PropTypes.func,
  renderLast: PropTypes.func,
};

PhotoGrid.defaultProps = {
  style: {},
  imageStyle: {},
  imageProps: {},
  width: width,
  height: 400,
  ratio: 1 / 3,
  renderItem: PhotoGrid.renderItem,
  renderLast: PhotoGrid.renderLast,
};

const styles = {
  image: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#fff',
  },
  lastWrapper: {
    flex: 1,
    backgroundColor: 'rgba(200, 200, 200, .5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCount: {
    color: '#fff',
    fontSize: 60,
  },
};

export default PhotoGrid;
