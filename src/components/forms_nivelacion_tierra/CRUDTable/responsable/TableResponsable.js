'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  createMRTColumnHelper,
} from 'material-react-table';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Typography,
  Button,
  Box,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import axios from 'axios';
import ProjectModal from '../ProjectModal';
import '../CRUDTable.css';

const TableResponsable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [modalMode, setModalMode] = useState('update');
  const [noDataMessage, setNoDataMessage] = useState('');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/acuerdos/`);
      setData(response.data);
      filterDataByUserState(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [apiUrl]);

  const filterDataByUserState = (data) => {
    const userState = localStorage.getItem('userState');
    if (userState) {
      const filtered = data.filter(item => item.estado === userState);
      setFilteredData(filtered);
      setNoDataMessage(filtered.length === 0 ? 'No hay acuerdos disponibles.' : '');
    } else {
      setFilteredData([]);
      setNoDataMessage('No hay acuerdos disponibles.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateClick = (projectId) => {
    setSelectedProjectId(projectId);
    setModalMode('update');
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProjectId(null);
    fetchData();
  };

  const columnHelper = createMRTColumnHelper();

  const columns = [
    columnHelper.accessor('id_unico', { header: 'ID Acuerdo' }),
    columnHelper.accessor('fecha_creacion', { header: 'Fecha' }),
    columnHelper.accessor('descripcion_acuerdo', { header: 'Descripción del Acuerdo' }),
    columnHelper.accessor('descripcion_avance', { header: 'Descripción del Avance' }),
    columnHelper.accessor('nombre', { header: 'Nombre' }),
    columnHelper.accessor('apellido_paterno', { header: 'Apellido Paterno' }),
    columnHelper.accessor('apellido_materno', { header: 'Apellido Materno' }),
    columnHelper.accessor('area_adscripcion', { header: 'Área Adscripción' }),
    columnHelper.accessor('telefono', { header: 'Teléfono' }),
    columnHelper.accessor('extension', { header: 'Extensión' }),
    columnHelper.accessor('correo', { header: 'Correo' }),
    columnHelper.accessor('documentos', { header: 'Documentos' }),
    {
      id: 'acciones',
      header: 'Acciones',
      enableSorting: false,
      enableColumnPinning: true,
      muiTableBodyCellProps: { className: 'acciones-cell' },
      muiTableHeadCellProps: { className: 'acciones-header' },
      Cell: ({ row }) => (
        <Box className="Acciones-con">
          <Button
            variant="outlined"
            className="crud-button"
            onClick={() => handleUpdateClick(row.original.id)}
          >
            Actualizar
          </Button>
        </Box>
      ),
    },
  ];

  // CSV EXPORT config
  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    filename: 'acuerdos_responsable_export',
  });

  const sanitizeForCsv = (obj) => {
    const clean = {};
    for (const key in obj) {
      let value = obj[key];

      if (key === 'documentos') {
        if (Array.isArray(value)) {
          value = value.map((doc) =>
            typeof doc === 'string' ? doc : doc?.nombre || '[Documento]'
          ).join(', ');
        } else if (typeof value === 'object') {
          value = JSON.stringify(value);
        }
      }

      clean[key] =
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        value == null
          ? value
          : JSON.stringify(value);
    }
    return clean;
  };

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => sanitizeForCsv(row.original));
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportAllData = () => {
    const cleanData = filteredData.map(sanitizeForCsv);
    const csv = generateCsv(csvConfig)(cleanData);
    download(csvConfig)(csv);
  };

  const table = useMaterialReactTable({
    data: filteredData,
    columns,
    enableRowSelection: true,
    enableColumnActions: false,
    enableColumnPinning: true,
    enableDensityToggle: false,
    enableColumnFilters: true,
    initialState: {
      columnPinning: {
        right: ['acciones'],
      },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap', padding: '8px' }}>
        <Button onClick={handleExportAllData} startIcon={<FileDownloadIcon />}>
          Exportar todos los datos
        </Button>
        <Button
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
          startIcon={<FileDownloadIcon />}
        >
          Exportar seleccionados
        </Button>
      </Box>
    ),
    muiTableBodyRowProps: {
      sx: {
        '&:hover': {
          backgroundColor: 'rgba(230, 230, 230, 0.9)',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#f5f5f5',
        fontWeight: 'bold',
      },
    },
    localization: {
      actions: 'Acciones',
      noRecordsToDisplay: noDataMessage || 'No se encontraron registros',
      showHideColumns: 'Ver columnas',
      search: 'Buscar',
      clearSearch: 'Limpiar',
      filter: 'Filtrar',
      sortBy: 'Ordenar por',
    },
  });

  const theme = createTheme({
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '40px',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          h3: {
            fontWeight: 600,
            fontSize: '2.25rem',
            color: '#DEC9A3',
            fontFamily: 'Montserrat',
            padding: '10px',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="table_grid">
        <Typography variant="h3">Acuerdos Responsable</Typography>
        <MaterialReactTable table={table} />
      </div>

      <ProjectModal
        open={openModal}
        handleClose={handleCloseModal}
        projectId={selectedProjectId}
        mode={modalMode}
      />
    </ThemeProvider>
  );
};

export default TableResponsable;
