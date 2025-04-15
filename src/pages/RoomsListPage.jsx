import { useEffect, useRef, useState } from "react";
import axiosInstance from "../config/axios";
import { Box, Button, Checkbox, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useNavigate } from "react-router-dom";
import RoomFilters from "../components/RoomFilters";

function RoomsListPage() {
    // const [rooms, setRooms] = useState([]);
    const [paginationData, setPaginantionData] = useState({
        page: 1,
        limit: 10,
        total: 0,
        lastPage: 1
    });
    
    const [filters, setFilters] = useState({});
    const navigate = useNavigate();
    const gridApiRef = useRef(null);
    
    // const onGridRedy = () => {
    //     fetchRoomsList(paginationData.page)
    // }

    // const fetchRoomsList = async () => {
    //     try {
    //         const res = await axiosInstance.get(`/api/v1/rooms`);
    //         // console.log(res)
    //         if(res.status === 200) {
    //             setRooms(res.data?.data);
    //             setPaginantionData(res.data?.paginationData);
    //         }
    //     } catch (error) {
    //         console.error('error while fetching rooms', error);
    //     }
    // }

    const columns = [
        { field: 'type', headerName: 'Room Type', sortable: true, filter: false},
        { field: 'location', sortable: true, filter: false},
        { field: 'occupancy', sortable: true, filter: false},
        { field: 'price', sortable: true, filter: false},
        { field: 'id', sortable: true, filter: false},
        { 
            field: 'isAvailable', 
            headerName: 'Available', 
            sortable: true,
            filter: false,
            cellRenderer: (data) => {
                // console.log('data:-', data)
                return data.data?.isAvailable ? "Available" : "Not Available"
            } 
        },
        {
            headerName: 'Actions',
            sortable: false,
            filter: false,
            cellRenderer: (data => {
                return (
                    <IconButton
                        color="primary"
                        onClick={()=>handleBookRoom(data.data)}
                        disabled={!data.data?.isAvailable}
                        // startIcon={<AddIcon />}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '0.9rem',
                            minWidth: '120px',
                            '&:hover': {
                                backgroundColor: data.data?.isAvailable ? 'success.light' : 'disabled',
                            },
                            mb: 2
                        }}
                        title={data.data?.isAvailable ? "Book this room" : "Room Not Available"}
                    >
                        <span style={{fontSize: 12 }}>{data.data?.isAvailable ? "Book Room" : "Not Available"}</span>
                    </IconButton>
                )
            })
        }
    ];

    const handleBookRoom = (roomData) => {
        navigate(`/book/${roomData.id}`, {
            state: {
                room: roomData
            }
        });
    }

    // const buildFilterQuery = (filterModel) => {
    //     const queryParts = [];
    //     if(filterModel.type?.filter) {
    //         queryParts.push(`type=${filterModel.type?.filter}`);
    //     }

    //     if(filterModel.location?.filter) {
    //         queryParts.push(`location=${filterModel.location?.filter}`);
    //     }

    //     return queryParts.join('&');
    // }

    const buildSortingQuery = (sortModel) => {
        if(sortModel.length > 0) {
            const sort = sortModel[0];
            const sortQuery = `sort=${sort.colId}:${sort.sort}`;
            return sortQuery;
        }
        return '';
    }

    
    useEffect(() => {
        if(gridApiRef.current) {
            gridApiRef.current.purgeInfiniteCache();
        }
    }, [filters]);

    return (
        <Box sx={{ display: 'flex', height: '100vh'}}>
            {/* <Button onClick={()=>fetchRoomsList()}>fetchRooms</Button>
            <Button onClick={()=>console.log(formValues)}>formValues</Button> */}
            <Box sx={{
                width: 200,
                p: 3,
                borderRight: 1,
                borderColor: 'divider'
            }}>
                <RoomFilters onSubmit={setFilters} /> 
            </Box>
            <Box sx={{ flexGrow: 1, p: 3}}>
                <Box className="ag-theme-alpine" sx={{ height: "80vh", width: '100%' }}>
                    <AgGridReact 
                        ref={(gridRef) => {
                            if(gridRef) gridApiRef.current = gridRef.api;
                        }}
                        // rowData={rooms}
                        columnDefs={columns}
                        rowModelType="infinite"
                        // className="ag-theme-alpine"
                        defaultColDef={{
                            sortable: true,
                            filter: true,
                            floatingFilter: true,
                            resizable: true,
                        }}
                        // pagination={true}
                        paginationPageSize={paginationData.limit}
                        // onPaginationChanged={handlePaginationChanged}
                        cacheBlockSize={paginationData.limit}
                        datasource={{
                            getRows: async (params) => {
                                // console.log('params: ', params)
                                const {startRow, endRow, filterModel, sortModel} = params;
                                const limit = endRow - startRow;
                                const skip = startRow;
                                
                                // const filters = buildFilterQuery(filterModel)
                                const filterParams = new URLSearchParams({
                                    skip,
                                    limit,
                                    // ...filters
                                    ...(filters.roomType && {type: filters.roomType}),
                                    ...(filters.location && {location: filters.location}),
                                    ...(filters.occupancy && {occupancy: filters.occupancy}),
                                    ...(filters.minPrice && {minPrice: filters.minPrice}),
                                    ...(filters.maxPrice && {maxPrice: filters.maxPrice}),
                                    ...(filters.isAvailable && {isAvailable: filters.isAvailable}),
                                }).toString();
                                console.log('filter params:', filterParams)
                                const sort = buildSortingQuery(sortModel)

                                try {
                                    const res = await axiosInstance.get(`/api/v1/rooms?${filterParams}&${sort}`);
                                    // console.log('res rooms',res)
                                    if(res.status === 200) {
                                        params.successCallback(res.data?.data, res.data?.paginationData?.total);
                                    }
                                } catch (error) {
                                    console.error('error while fetching rooms', error);
                                    params.failCallback();
                                }
                            }
                        }}
                    />
                </Box>
            </Box>
        </Box>
    )
}

export default RoomsListPage;