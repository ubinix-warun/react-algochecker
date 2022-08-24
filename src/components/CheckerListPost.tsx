
import * as React from 'react';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import { forwardRef, useRef } from "react"
import axios from 'axios';

// const API_CHECKER_URL = process.env.REACT_APP_API_CHECKER_URL;
const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;

// {
// 	"timestamp": "2022-08-22T06:40:38.779Z",
// 	"name": "tinymanorg/tinyman-contracts-v1",
// 	"network": "Testnet",
// 	"appid": "62368684",
// 	"onchain": "<>",
// 	"githuburl": "https://github.com/tinymanorg/tinyman-contracts-v1/tree/v1-1-updates",
// 	"sha": "fb0e25845d3ad3660ab39c32997c3f1cfd6113be",
//  "path": "contracts/validator_approval.teal"
// 	"offchain": "<>"
//   }

interface Column {
  id: 'timestamp' | 'repo' | 'network' | 'appid' | 'file' | 'check' ;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'check', label: 'Result', minWidth: 10 },
  { id: 'appid', label: 'Application ID', minWidth: 100 },
  { id: 'network', label: 'Network', minWidth: 100 },
  { id: 'repo', label: 'Repo', minWidth: 170 },
  { id: 'file', label: 'File', minWidth: 50 },

];

  // { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
  // {
  //   id: 'population',
  //   label: 'Population',
  //   minWidth: 170,
  //   align: 'right',
  //   format: (value: number) => value.toLocaleString('en-US'),
  // },
  // {
  //   id: 'size',
  //   label: 'Size\u00a0(km\u00b2)',
  //   minWidth: 170,
  //   align: 'right',
  //   format: (value: number) => value.toLocaleString('en-US'),
  // },
  // {
  //   id: 'density',
  //   label: 'Density',
  //   minWidth: 170,
  //   align: 'right',
  //   format: (value: number) => value.toFixed(2),
  // },

export interface CheckerData {
  timestamp: string;
  name: string;
  network: string;
  appid: string;
  onchain: string;
  githuburl: string;
  sha: string;
  path: string;
  offchain: string;

  key: string;
}

export function CreateCheckerData(
  timestamp: string,
  name: string,
  network: string,
  appid: string,
  onchain: string,
  githuburl: string,
  sha: string,
  path: string,
  offchain: string,
  key: string
): CheckerData {

  return { 
    timestamp: timestamp,
    name: name,
    network: network,
    appid: appid,
    onchain: onchain,
    githuburl: githuburl,
    sha: sha,
    path: path,
    offchain: offchain,
    key: key,
 };
}

// const rows = [
//   createCheckerData("2022-08-22T06:40:38.779Z","tinymanorg/tinyman-contracts-v1","Testnet","62368684","<>",
//   "https://github.com/tinymanorg/tinyman-contracts-v1/tree/v1-1-updates","fb0e25845d3ad3660ab39c32997c3f1cfd6113be","contracts/validator_approval.teal","<>",""),
// ];

interface CheckerListPostProps {
  post: {
    // callRefresh: React.MutableRefObject<()=>{}>,
    clist: CheckerData[],
  };
}

export default function CheckerListPost(props: CheckerListPostProps) {
  const { post } = props;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

	// const [checkerList, setCheckerList] = React.useState<CheckerData[]>([]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {post.clist
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.appid}>
                  {columns.map((column) => {
                    if(column.id === 'repo') 
                    {
                      const value = row['name'] + " (" + row['sha'].substring(0,7)+"..." + ")";
                      const userrepo = row['name'];
                      const sha = row['sha'];

                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Link href={`${GITHUB_URL}/${userrepo}/tree/${sha}`} color="inherit" target="_blank">
                          {value}
                          </Link>
                        </TableCell>
                      );

                    } else if(column.id === 'file') 
                    {
                      const value = row['name'] + " (" + row['sha'].substring(0,7)+"..." + ")";
                      const userrepo = row['name'];
                      const sha = row['sha'];
                      const path = row['path'];

                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Link href={`${GITHUB_URL}/${userrepo}/tree/${sha}/${path}`} color="inherit" target="_blank">
                            <FileOpenIcon></FileOpenIcon>
                          </Link>
                        </TableCell>
                      );

                    } else if(column.id === 'check') 
                    {
                      // const value = row[column.id];

                      if(row['onchain'] === '' || row['offchain'] === '') 
                      {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <Tooltip title="Disable with Empty.">
                              <VerifiedUserIcon color="disabled" />
                            </Tooltip>
                          </TableCell>
                        );
                      } 

                      if(row['onchain'] === row['offchain'])
                      {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <Tooltip title="Matched">
                              <VerifiedUserIcon color="success" />
                            </Tooltip>
                          </TableCell>
                        );
                      }
                      else
                      {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <Tooltip title="Mismatch">
                              <VerifiedUserIcon color="error" />
                            </Tooltip>
                          </TableCell>
                        );
                      }


                    } else if(column.id === 'appid') 
                    {
                      
                      const value = row[column.id];

                      // https://algoindexer.algoexplorerapi.io/v2/applications/552635992
		                  // https://algoindexer.testnet.algoexplorerapi.io/v2/applications/62368684

                      // https://algoexplorer.io/application/552635992
                      // https://testnet.algoexplorer.io/application/62368684

                      if(row['network'] === "Testnet") 
                      {
                        return (
                        <TableCell key={column.id} align={column.align}>
                          <Link href={`https://testnet.algoexplorer.io/application/${value}`} color="inherit" target="_blank">
                          {value}
                          </Link>
                        </TableCell>
                         );

                      } else
                      {
                        return (
                        <TableCell key={column.id} align={column.align}>
                          <Link href={`https://algoexplorer.io/application/${value}`} color="inherit" target="_blank">
                          {value}
                          </Link>
                        </TableCell>
                         );
                      }

                    } else 
                    {
                       const value = row[column.id];

                       return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );

                    }

                  })}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={[10, 25, 100]}
      component="div"
      count={post.clist.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </Paper>
    );
}