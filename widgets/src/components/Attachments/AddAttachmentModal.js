import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { DropzoneArea } from 'material-ui-dropzone';
import Button from '@material-ui/core/Button';

const styles = {
  buttonWrapper: {
    padding: '10px 0',
    textAlign: 'right',
  },
  dropZone: {
    width: 400,
  },
  dropZoneText: {
    padding: 10,
    fontSize: 15,
  },
};

class AddAttachmentModal extends React.Component {
  state = {
    files: [],
  };

  handleChange = files => {
    this.setState({ files });
  };

  handleUploadButton = () => {
    const { files } = this.state;
    const { onUpload } = this.props;
    onUpload(files);
  };

  render() {
    const { files } = this.state;
    const { classes, onClose } = this.props;

    return (
      <>
        <DropzoneArea
          onChange={this.handleChange}
          dropzoneText="Click or Drag and Drop your attachments"
          dropzoneParagraphClass={classes.dropZoneText}
          dropzoneClass={classes.dropZone}
        />
        <div className={classes.buttonWrapper}>
          <Button variant="outlined" color="default" onClick={onClose}>
            Close
          </Button>{' '}
          <Button
            disabled={!files.length}
            variant="contained"
            color="primary"
            onClick={this.handleUploadButton}
          >
            Upload files
          </Button>
        </div>
      </>
    );
  }
}

AddAttachmentModal.propTypes = {
  classes: PropTypes.shape({
    buttonWrapper: PropTypes.string,
    dropZone: PropTypes.string,
    dropZoneText: PropTypes.string,
  }).isRequired,
  onUpload: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(AddAttachmentModal);
