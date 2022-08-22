import './App.css';

import React from 'react';
import { useState, useRef } from 'react';
import DeployApp from './components/DeployApp';
import IncreaseCounter from './components/IncreaseCounter';
import ReadAppData from './components/ReadAppData';
import WalletConnect from './components/WalletConnect';
import { APP_ID } from './constant';
import { readLocalStorage } from './utility';

import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TextField from '@mui/material/TextField';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import PostAddIcon from '@mui/icons-material/PostAdd';
import IconButton from '@mui/material/IconButton';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';

import LinearProgress from '@mui/material/LinearProgress';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';

import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import CheckerListPost, { CheckerData, CreateCheckerData } from './components/CheckerListPost';

import axios from 'axios';


import { styled, alpha } from '@mui/material/styles';
const { SwitchNet, Card } = require('pipeline-ui');

const API_CHECKER_URL = process.env.REACT_APP_API_CHECKER_URL;
const API_INDEXER_TESTNET = process.env.REACT_APP_API_INDEXER_TESTNET_URL;
const API_INDEXER_MAINNET = process.env.REACT_APP_API_INDEXER_MAINNET_URL;
const API_GITHUB_URL = process.env.REACT_APP_API_GITHUB_URL;
const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;

const theme = createTheme();

type Anchor = 'top' | 'left' | 'bottom' | 'right';
const drawerAnchor = 'right';
const drawerWidth = 520;

const appname = 'AlgoChecker';

export type FileMeta = {
	path: string;
	mode: string;
	type: string;
	sha: string;
	size: number;
	url: string;
}

export type BranchMeta = {
	name: string;
	commit: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref,
  ) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


const Networks = ['Mainnet', "Testnet"];

const App = () => {
	const [address, updateAddress] = useState<string>('');
	const [appId, updateAppId] = useState<string | undefined>(undefined);

	// const checkerListPostRef = React.useRef<HTMLInputElement>(null);
	// const refreshCheckerFunc = React.useRef(()=>{})

	const [applicationID, setApplicationID] = React.useState('');
	const [network, setNetwork] = React.useState('');

	const [showLoading1, setShowLoading1] = React.useState(false);
	const [opCode1, setOpCode1] = React.useState('');

	const [githubURL, setGithubURL] = React.useState('');
	const [gitBranch, setGitBranch] = React.useState('');
	const [gitCommit, setGitCommit] = React.useState('');
	const [gitProject, setGitProject] = React.useState('');
	const [targetFile, setTargetFile] = React.useState<FileMeta|undefined>(undefined);

	const [showLoading2, setShowLoading2] = React.useState(false);
	const [opCode2, setOpCode2] = React.useState('');

	const [disabledBranch, setDisabledBranch] = React.useState(true);
	const [loadBranchs, setLoadBranchs] = React.useState<BranchMeta[]>([]);
	const [loadFiles, setLoadFiles] = React.useState<FileMeta[]>([]);

	const [snackApiErrorMessage, setSnackApiErrorMessage] = React.useState('');
	const [openSnackApiError, setOpenSnackApiError] = React.useState(false);
	const [snackApiWarningMessage, setSnackApiWarningMessage] = React.useState('');
	const [openSnackApiWarning, setOpenSnackApiWarning] = React.useState(false);

	const [checkerList, setCheckerList] = React.useState<CheckerData[]>([]);

	// const handleClick = () => {
	//   setOpen(true);
	// };
  
	const handleCloseSnackApiError = (event?: React.SyntheticEvent | Event, reason?: string) => {
	  if (reason === 'clickaway') {
		return;
	  }
  
	  setSnackApiErrorMessage('');
	  setOpenSnackApiError(false);
	};
	
	const handleCloseSnackApiWarning = (event?: React.SyntheticEvent | Event, reason?: string) => {
	  if (reason === 'clickaway') {
		return;
	  }

	  setSnackApiWarningMessage('');
	  setOpenSnackApiWarning(false);
	};
	
	  
	const handleAppIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const appId = event.target.value;
		setApplicationID(appId);
	};

	const handleNetworkChange = (event: SelectChangeEvent) => {
		const network = event.target.value as string;
		setNetwork(network);
	};


	const addChecker = () => {

		// {
		// 	"timestamp": "",
		// 	"name": "Tinyman Validator",
		// 	"network": "Testnet",
		// 	"appid": "62368684",
		// 	"onchain": "",
		// 	"githuburl": "https://github.com/tinymanorg/tinyman-contracts-v1/tree/v1-1-updates",
		// 	"sha": "fb0e25845d3ad3660ab39c32997c3f1cfd6113be",
		// 	"offchain": ""
		//   }

		var splitted = githubURL.split("/", 10); 
		const user = splitted[3];
		const repo = splitted[4];

		axios.post(`${API_CHECKER_URL}/checker`,
		{
			timestamp: new Date().toISOString(),
			name: user+"/"+repo,
			network: network,
			appid: applicationID,
			onchain: opCode1,
			githuburl: githubURL,
			sha: gitCommit,
			path: targetFile?.path,
			offchain: opCode2,
		}).then(
			res => {
				
				setShowLoading2(false);

				clearDataAll();

				RefreshCheckerList();

				setStateDrawer({
					top: false,
					left: false,
					bottom: false,
					right: false,
				  });


			}).catch(error => {

				showSnackApiError(error, "ApiChecker");

				console.log(error);
				setShowLoading2(false);

			});

	}

	const clearDataAll = () => {
	
		setApplicationID('');
		setNetwork('');
		setShowLoading1(false);
		setOpCode1('');

		setGithubURL('');
		setOpCode2('');

		clearData2();
	}

	const getOnChainOpCode = () => {
	
		// https://algoindexer.algoexplorerapi.io/v2/applications/552635992
		// https://algoindexer.testnet.algoexplorerapi.io/v2/applications/62368684

		setShowLoading1(true);
		setOpCode1('');

		if(network !== 'Testnet' && network !== 'Mainnet')
		{
			setShowLoading1(false);
			return;
		}

		let url = `${API_INDEXER_MAINNET}/v2/applications/${applicationID}`;
		if(network === "Testnet") 
		{
			url = `${API_INDEXER_TESTNET}/v2/applications/${applicationID}`;
		}

		axios.get(url).then(
			res => {

				const apps = res.data;
				// console.log(apps.application.params['approval-program']);
				
				setOpCode1(apps.application.params['approval-program']);
				setShowLoading1(false);

			}).catch(error => {

				showSnackApiError(error, "ApiIndexer");

				console.log(error);

				setOpCode1('');
				setShowLoading1(false);

			});
		};

	const handleAppIDBlur = () => {
		getOnChainOpCode();
	};

	const handleNetworkBlur = () => {
		getOnChainOpCode();
	};

	const getFileFromRepo = (u: string, r: string, b: string) => {

		const url = `${API_GITHUB_URL}/repos/${u}/${r}/git/trees/${b}?recursive=1`;
		setGitProject(`${GITHUB_URL}/${u}/${r}/tree/${b}`);
		
		axios.get(url).then(
			res => {

				let tmpFiles: FileMeta[] = [];
				const files = res.data;
				for (let i in files.tree) {
					// console.log(i, files.tree[i].path);
					let filePath = files.tree[i].path;
					if(filePath.endsWith(".teal") 
						|| filePath.endsWith(".py")
						|| filePath.endsWith(".rsh"))
					{
						// tmpFiles = [...tmpFiles, files.tree[i].path];
						tmpFiles = [...tmpFiles, files.tree[i]];

					}
				}
				setLoadFiles(tmpFiles);
				setGitCommit(files.sha);
				setShowLoading2(false);

			}).catch(error => {

				showSnackApiError(error, "ApiGithub");

				console.log(error);

				setShowLoading2(false);

			});
	};

	const getBranchFromRepo = (u: string, r: string) => {

		const url = `${API_GITHUB_URL}/repos/${u}/${r}/branches`;
		setGitProject(`${GITHUB_URL}/${u}/${r}`);

		axios.get(url).then(
			res => {

				let tmpBranchs: BranchMeta[] = [];
				const branchs = res.data;
				console.log(branchs);

				for (let i in branchs) {
					tmpBranchs = [...tmpBranchs, 
						{
							name: branchs[i].name,
							commit: branchs[i].commit.sha,
						}];
				}

				if(tmpBranchs.length > 0)
				{
					setDisabledBranch(false);

				}

				setLoadBranchs(tmpBranchs);
				setShowLoading2(false);

			}).catch(error => {

				showSnackApiError(error, "ApiGithub");

				console.log(error);
				setShowLoading2(false);

			});
	};


	const handleGithubURLChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const url = event.target.value;

		clearData2();

		if(url !== undefined) 
		{
			if(url.startsWith("https://github.com/"))
			{
				var splitted = url.split("/", 10); 
				if(splitted.length === 7) 
				{
					// GOT TREE
					setShowLoading2(true);
					setDisabledBranch(true);

					// Call get file!
					const user = splitted[3];
					const repo = splitted[4];
					const branch = splitted[6];
					
					setLoadBranchs([{
						name: branch,
						commit: branch,
					}]);
					setGitBranch(branch);

					getFileFromRepo(user, repo, branch)

				} else if(splitted.length === 6)
				{
					if(splitted[6].length === 0) 
					{
						const user = splitted[3];
						const repo = splitted[4];
						
						// GOT TREE
						setShowLoading2(true);
						setDisabledBranch(true);

						getBranchFromRepo(user, repo);

					}

				} else if(splitted.length === 5)
				{
					const user = splitted[3];
					const repo = splitted[4];

					// GOT TREE
					setShowLoading2(true);
					setDisabledBranch(true);

					getBranchFromRepo(user, repo);

				}
			}
		}

		setGithubURL(url);
		
	  };

	const clearData2 = () => {

		setShowLoading2(false);
		setDisabledBranch(true);

		setLoadBranchs([]);
		setGitBranch('');
		setGitCommit('');
		setGitProject('');
		setOpCode2('');
		setTargetFile(undefined);
		setLoadFiles([]);
	};

	// const handleGithubURLBlur = () => {

	// 	const url = githubURL;
		
	// 	// startWith https://github.com/
	// 	// 	--- <USER>/<REPO> => LOAD BRANCH
	// 	//  --- <USER>/<REPO>/tree/<HASH>

	// 	clearData2();

	// 	if(url !== undefined) 
	// 	{
	// 		if(url.startsWith("https://github.com/"))
	// 		{
	// 			var splitted = url.split("/", 10); 
	// 			if(splitted.length === 7) 
	// 			{
	// 				// GOT TREE
	// 				setShowLoading2(true);
	// 				setDisabledBranch(true);

	// 				// Call get file!
	// 				const user = splitted[3];
	// 				const repo = splitted[4];
	// 				const branch = splitted[6];
					
	// 				setLoadBranchs([{
	// 					name: branch,
	// 					commit: branch,
	// 				}]);
	// 				setGitBranch(branch);

	// 				getFileFromRepo(user, repo, branch)

	// 			} else if(splitted.length === 6)
	// 			{
	// 				if(splitted[6].length === 0) 
	// 				{
	// 					const user = splitted[3];
	// 					const repo = splitted[4];
						
	// 					// GOT TREE
	// 					setShowLoading2(true);
	// 					setDisabledBranch(true);

	// 					getBranchFromRepo(user, repo);

	// 				}

	// 			} else if(splitted.length === 5)
	// 			{
	// 				const user = splitted[3];
	// 				const repo = splitted[4];

	// 				// GOT TREE
	// 				setShowLoading2(true);
	// 				setDisabledBranch(true);

	// 				getBranchFromRepo(user, repo);

	// 			}
	// 		}
	// 	}

	// 	// <HASH> => DISABLE 

	// 	// <USER>
	// 	// <REPO>
	// 	// <HASH> => LIST FILE (.teal) row=3

	//   };


	const handleGitBranchChange = (event: SelectChangeEvent) => {
		const branch = event.target.value as string;
		
		var splitted = githubURL.split("/", 10); 
		const user = splitted[3];
		const repo = splitted[4];
		
		setGitCommit('');
		setOpCode2('');
		setTargetFile(undefined);
		setLoadFiles([]);
		
		setGitBranch(branch);

		setShowLoading2(true);
		// setDisabledBranch(true);

		getFileFromRepo(user, repo, branch)

	};

	const handleSelectFile = (f: FileMeta) => {
		setTargetFile(f);
	};

	const handleDeleteFileSelected = () => {
		setTargetFile(undefined);
		setShowLoading2(false);
		setOpCode2('');
	};

	const handleCompileSelected = () => {
		setOpCode2('');
		setShowLoading2(true);

		var fileType = "";
		
		if(targetFile?.path.endsWith(".teal"))
		{
			fileType = "TEAL"
		} else if(targetFile?.path.endsWith(".py"))
		{
			fileType = "PYTEAL"
		} else if(targetFile?.path.endsWith(".rsh"))
		{
			fileType = "REACH"
		}

		axios.post(`${API_CHECKER_URL}/compile`,
		{
			type:fileType,
			url:targetFile?.url
		}).then(
			res => {
				
				const respData = res.data;

				setOpCode2(respData.out)
				setShowLoading2(false);

				console.log(opCode1)
				console.log(respData.out)

				if(opCode1 !== respData.out)
				{
					showSnackApiWarning("MissMatch", "OpCode");
				}

			}).catch(error => {

				showSnackApiError(error, "ApiCompile");

				console.log(error);
				setOpCode2('');
				setShowLoading2(false);

			});

	};

	const showSnackApiError = (error: any, tag: string) => {

		setSnackApiErrorMessage(tag + ": " + error.message);
		setOpenSnackApiError(true);
	};

	const showSnackApiWarning = (msg: any, tag: string) => {

		setSnackApiWarningMessage(tag + ": " + msg);
		setOpenSnackApiWarning(true);
	};

	const fixBranch = (): boolean => {
		return disabledBranch;
	};
	
	const waitCompile = (): boolean => {
		return showLoading2;
	};

	const showCompile = (): boolean => {
		if(targetFile === undefined)
			return false;
		if(opCode2 !== '')
			return false;

		return true;
	};

	const showMatched = (): boolean => {
		if(opCode1 === '')
			return false;
		if(opCode2 === '')
			return false;

		return opCode1 === opCode2;
	};


	const [stateDrawer, setStateDrawer] = React.useState({
		top: false,
		left: false,
		bottom: false,
		right: false,
	  });
	
	const toggleDrawer =
		(anchor: Anchor, open: boolean) =>
		(event: React.KeyboardEvent | React.MouseEvent) => {
			if (
			event &&
			event.type === 'keydown' &&
			((event as React.KeyboardEvent).key === 'Tab' ||
				(event as React.KeyboardEvent).key === 'Shift')
			) {
			return;
			}

			setStateDrawer({ ...stateDrawer, [anchor]: open });
		};

		
	// setInterval(() => {
	// 	const newAppId = readLocalStorage(APP_ID);
	// 	// current app id != new app id generated
	// 	if (appId != newAppId) {
	// 		if (newAppId) {
	// 			updateAppId(newAppId);
	// 		}
	// 	}
	// }, 4000);

	const RefreshCheckerList = () => {

		axios.get(`${API_CHECKER_URL}/checker`).then(
		  res => {
	
			setCheckerList([]);
	
			let tmpCheckerList: CheckerData[] = [];
			const clist = res.data;
	
			for(const k in clist) {
			  const v = clist[k];
			  tmpCheckerList = [
				...tmpCheckerList, 
				CreateCheckerData(
				  v.timestamp,
				  v.name,
				  v.network,
				  v.appid,
				  v.onchain,
				  v.githuburl,
				  v.sha,
				  v.path,
				  v.offchain,
				  k
				)];
			}
	
			setCheckerList(tmpCheckerList);
	
			// Object.keys(clist).forEach(key => {
			//   console.log(key, clist[key]);
			//   setCheckerList(
			//     [ 
			//       ...checkerList, 
			//         createCheckerData(
			//           clist[key].timestamp,
			//           clist[key].name,
			//           clist[key].network,
			//           clist[key].appid,
			//           clist[key].onchain,
			//           clist[key].githuburl,
			//           clist[key].sha,
			//           clist[key].path,
			//           clist[key].offchain,
			//           key)
			//     ]);
			// });
	
		  }).catch(error => {
	
			console.log(error);
	
		  });
	
	
	  };

	  
	const checkerListPost = {
		// callRefresh: refreshCheckerFunc
		clist: checkerList,
		
	  };


	  React.useEffect(() => {

		RefreshCheckerList();
	
		// setInterval(() => {
	
		// }, 5000);
	
	  }, []);

	return (

		<ThemeProvider theme={theme}>
			<CssBaseline />
  
	  		<div className="App">

			  <Snackbar open={openSnackApiError} autoHideDuration={6000} onClose={handleCloseSnackApiError}>
				<Alert onClose={handleCloseSnackApiError} severity="error" sx={{ width: '100%' }}>
				{snackApiErrorMessage}
				</Alert>
			  </Snackbar>
			  <Snackbar open={openSnackApiWarning} autoHideDuration={6000} onClose={handleCloseSnackApiWarning}>
				<Alert onClose={handleCloseSnackApiWarning} severity="warning" sx={{ width: '100%' }}>
				{snackApiWarningMessage}
				</Alert>
			  </Snackbar>

			  <React.Fragment key={drawerAnchor}>
				<SwipeableDrawer
				anchor={drawerAnchor}
				open={stateDrawer[drawerAnchor]}
				onClose={toggleDrawer(drawerAnchor, false)}
				onOpen={toggleDrawer(drawerAnchor, true)}
				>
				<Stack spacing={2}
					sx={{ width: drawerWidth }}
					// role="presentation"
					onClick={toggleDrawer(drawerAnchor, true)}
					onKeyDown={toggleDrawer(drawerAnchor, true)}
					style={{marginTop: 90, marginLeft: 20, marginRight: 20}}
					>
					<Typography variant="h5" component="h5">
					Verify The Open Source. 
					</Typography>
					<Divider/>
					<Stack
						direction="row"
						divider={<Divider orientation="vertical" flexItem />}
						spacing={2}
						>
						<TextField 
							sx={{ width: drawerWidth - 120 }} 
							id="outlined-appid" label="Application ID" variant="outlined"
							value={applicationID}
							onChange={handleAppIDChange} 
							onBlur={() => handleAppIDBlur()} />
						<Select
							labelId="network-select-label"
							id="network-select" 
							value={network}
							label="Network"
							onChange={handleNetworkChange}
							onBlur={() => handleNetworkBlur()} 
							sx={{ width: 100 }} 
						  >
						  {Networks.map((network) => (
							<MenuItem value={network}>{network}</MenuItem>
						  ))}
						</Select>
					</Stack>
					{ showLoading1 ? <LinearProgress color="inherit" /> : <></> }
					{ opCode1 !== '' ? 
						<TextField disabled id="outlined-basic-opcode1"  variant="outlined" 
							value={opCode1}
						/>
						: <></> }
					<Divider/>
					<Stack
						direction="row"
						divider={<Divider orientation="vertical" flexItem />}
						spacing={2}
						>
						<TextField 
							sx={{ width: drawerWidth - 120 }} 
							id="outlined-github-url" label="Github URL" variant="outlined"
							value={githubURL}
							onChange={handleGithubURLChange} 
							// onBlur={() => handleGithubURLBlur()}
							/>
						<Select
							labelId="branch-select-label"
							id="branch-select" 
							value={gitBranch}
							label="Branch"
							onChange={handleGitBranchChange}
							sx={{ width: 100 }} 
							disabled={fixBranch()}
						  >
						  {loadBranchs.map((branch) => (
							<MenuItem value={branch.commit}>{branch.name}</MenuItem>
						  ))}
						</Select>
					</Stack>
					{ showLoading2 ? <LinearProgress color="inherit" /> : <></> }
					{ loadFiles.length > 0 ? 
							// <Typography variant="subtitle1">
							// Select File from Git {gitCommit}
							// </Typography>
							<Stack
								direction="row"
								alignItems="center"
								divider={<Divider orientation="vertical" flexItem />}
								spacing={1}
								sx={{minHeight: 40}}
								>	
									<Typography ></Typography>
									<Typography variant='subtitle2' >
										SHA
									</Typography>
									<Link href={gitProject} color="inherit" target="_blank">
									{gitCommit.substring(0,7)+"..."}
									</Link>
									{ targetFile !== undefined ? 
										<Chip sx={{maxWidth: 320}} label={targetFile.path} 
											color={opCode1 === opCode2 ? "success":"default"} 
											onDelete={handleDeleteFileSelected} />
										: <></> }
									{/* <FormControlLabel 
										control={<Checkbox size="small" defaultChecked color="default" />} 
										label={<Typography variant='subtitle2'>TEAL</Typography>}	/> */}
							</Stack>
								: <></> }
					{ targetFile === undefined ? 
						<List subheader={
							<></>
							// <ListSubheader component="div" id="nested-list-subheader">
							// 	{/* <FormControlLabel control={<Checkbox defaultChecked color="default" />} label="TEAL" /> */}
							// </ListSubheader>
							}>
							{loadFiles.map((file, index) => (
							<ListItem disablePadding 
								onClick={() => {handleSelectFile(file)}}
							>
								<ListItemButton >
								<ListItemText primary={file.path} />
								</ListItemButton>
							</ListItem>
							))}
					</List>
						: <></> }
					{ (showCompile()) ? 
						<Button variant="contained" sx={{background: '#2E3B55'}} 
						disabled={waitCompile()} onClick={handleCompileSelected}>Compile</Button>
						: <></> }
					{ opCode2 !== '' ? 
						<TextField disabled id="outlined-basic-opcode2"  variant="outlined" 
							value={opCode2}
						/>
						: <></> }
					{ opCode2 !== '' ? 
						<Divider></Divider>
						: <></> }
					{ (showMatched()) ? 
						// <Chip label="Matched" color="success" variant="outlined" />
						<Button variant="contained" color="success" onClick={() => {addChecker()}}
							>Matched</Button>
						: <></> }
				</Stack>
				{/* <Box
					sx={{ width: drawerWidth }}
					// role="presentation"
					onClick={toggleDrawer(drawerAnchor, true)}
					onKeyDown={toggleDrawer(drawerAnchor, true)}
					style={{marginTop: 90, marginLeft: 20}}
					>
					<TextField id="outlined-basic" label="Github URL" variant="outlined" />
					<TextField id="outlined-basic" label="Outlined" variant="outlined" /> 
				</Box> */}
				</SwipeableDrawer>
			</React.Fragment>

      		  {/* <AppBar position="relative" style={{ background: '#2E3B55' }}> */}
			  <AppBar position="relative" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: '#2E3B55' }} >
			  <Container maxWidth="xl">
			  </Container>
        		<Toolbar disableGutters sx={{marginLeft:1}}>

				{/* DISPLAY 1 */}
				<Box display='flex' flexGrow={0.05} sx={{ display: { xs: 'none', md: 'flex' } }}></Box>
				<VerifiedUserIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
				<Typography
					variant="h6"
					noWrap
					component="a"
					href="/"
					sx={{
					mr: 2,
					display: { xs: 'none', md: 'flex' },
					fontFamily: 'monospace',
					fontWeight: 700,
					letterSpacing: '.1rem',
					color: 'inherit',
					textDecoration: 'none',
					}}
				>
					{appname}
				</Typography>
				<Box display='flex' flexGrow={0.93} sx={{ display: { xs: 'none', md: 'flex' } }}></Box>
          
				<Box sx={{ minWidth: 70 }}>
					<IconButton
					size="large"
					aria-label="wallet"
					aria-controls="menu-appbar"
					aria-haspopup="true"
					color="inherit"
					onClick={toggleDrawer(drawerAnchor, true)}
					>
					<PostAddIcon fontSize='large'/>
					</IconButton>
				</Box>
				</Toolbar>
			  </AppBar>

			  <Container maxWidth="lg" sx={{marginTop: 2}}>
				<main>
				{/* <CheckerListPost post={checkerListPost} ref={checkerListPostRef} /> */}
				<CheckerListPost post={checkerListPost} />

				</main>
			  </Container>
			</div>

		</ThemeProvider>
		
	);
};

export default App;

//<Card bg={'light-gray'} width={'auto'} maxWidth={'520px'} mx={'auto'}>
//<div className="App">
//	<h1>Number Increment App</h1>
//	<SwitchNet />
//	<br />
//	<WalletConnect updateAddress={updateAddress} />
//	{address.length ? <DeployApp /> : null}
//	{address.length && appId ? (
//		<>
//			{/* <IncreaseCounter addr={address} appId={parseInt(appId)} /> */}
//			{/* <ReadAppData appId={parseInt(appId)} /> */}
//		</>
//	) : null}
//</div>
//</Card>