import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { useState } from "react";

const baseUrl = process.env.REACT_APP_JSON_API;
export default function SearchAutoCompletePM(props) {
    const { searchData, setManager } = props;
    const handleChange = async (value) => {
        let searchResult = searchData.filter((item) =>
            item.StaffName.toLowerCase().includes(value.toLowerCase())
        )[0];

        setManager(searchResult);
    };
    return (
        <>
            <div className="search-contain d-flex justify-content-end my-3">
                <Stack spacing={2} sx={{ width: 300 }}>
                    <Autocomplete
                        freeSolo
                        disableClearable
                        sx={{ width: "100%" }}
                        options={searchData.map((option) => option.StaffName)}
                        onChange={(event, newValue) => {
                            handleChange(newValue);
                        }}
                        key={searchData.StaffID}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Click to choose Manager"
                                InputProps={{
                                    ...params.InputProps,
                                    type: "search",
                                }}
                                size="small"
                            />
                        )}
                    />
                </Stack>
            </div>
        </>
    );
}
