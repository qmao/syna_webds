import { ReactWidget } from '@jupyterlab/apputils';

import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import UploadButtons from './upload_ui'
import { ISignal, Signal } from '@lumino/signaling';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 224,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function VerticalTabs(
    props: {
        onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }
) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        <Tab label="Upload" {...a11yProps(0)} />
        <Tab label="Packrat" {...a11yProps(1)} />
        <Tab label="Cache" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <UploadButtons onChange={props.onFileChange}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Packrat
      </TabPanel>
      <TabPanel value={value} index={2}>
        Cache
      </TabPanel>
    </div>
  );
}


 
/**
 * A Counter Lumino Widget that wraps a CounterComponent.
 */
export class TabPanelUiWidget extends ReactWidget {
  /**
   * Constructs a new CounterWidget.
   */
    constructor() {
        super();
        this.addClass('jp-ReactWidget');
    }

    handleChangeFile(e: React.ChangeEvent<HTMLInputElement>) {
        console.log(e.currentTarget.files);
        this._valueChanged.emit(e);
    }

    render(): JSX.Element {
          return <VerticalTabs onFileChange={this.handleChangeFile} />;
    }

    public get valueChanged(): ISignal<this, React.ChangeEvent<HTMLInputElement>> {
        return this._valueChanged;
    }

    private _valueChanged = new Signal<this, React.ChangeEvent<HTMLInputElement>>(this);
}
