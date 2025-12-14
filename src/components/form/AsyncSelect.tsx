import { useEffect, useState, useCallback, useMemo } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import debounce from "lodash.debounce";

export default function AsyncSelect({
    label,
    value,
    onChange,
    fetchOptions,
    getOptionLabel = (o) => o?.name ?? "",
    placeholder = "",
    disabled = false,
    ...rest   // <- nhận props: sx, fullWidth, size,...
}) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadOptions = useCallback(
        async (keyword) => {
            setLoading(true);
            try {
                const list = await fetchOptions(keyword);
                setOptions(list || []);
            } finally {
                setLoading(false);
            }
        },
        [fetchOptions]
    );

    const debouncedLoad = useMemo(
        () => debounce((keyword) => loadOptions(keyword), 300),
        [loadOptions]
    );

    useEffect(() => {
        return () => debouncedLoad.cancel();
    }, [debouncedLoad]);

    useEffect(() => {
        if (open && options.length === 0) loadOptions("");
    }, [open, options.length, loadOptions]);

    useEffect(() => {
        if (!open) return;
        debouncedLoad(inputValue.trim());
    }, [inputValue, open, debouncedLoad]);

    useEffect(() => {
        if (!value) return;
        loadOptions("");
    }, [value, loadOptions]);

    const selectedOption =
        typeof value === "object"
            ? value
            : options.find((o) => o.id === value) || null;

    return (
        <Autocomplete
            {...rest}     // <- QUAN TRỌNG
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            disabled={disabled}
            loading={loading}
            value={selectedOption}
            options={options}
            getOptionLabel={getOptionLabel}
            onChange={(e, newVal) => onChange(newVal)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder={placeholder}
                    onChange={(e) => setInputValue(e.target.value)}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading && <CircularProgress size={20} />}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
}
