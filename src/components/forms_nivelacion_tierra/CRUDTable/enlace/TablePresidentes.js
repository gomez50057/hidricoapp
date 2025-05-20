'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  createMRTColumnHelper,
} from 'material-react-table';
import {
  createTheme,
  ThemeProvider,
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

const TablePresidentes = () => {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [modalMode, setModalMode] = useState('edit');

  const fetchData = useCallback(async () => {
    try {
      // GET /api/nivelaciones/ (sin parámetros) muestra solo las nivelaciones creadas por el usuario actual gracias a get_queryset() que filtra por created_by=self.request.user
      const response = await axios.get('/api/nivelaciones/', {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Actualizamos handleAction para recibir el folio y, si es evaluador, lo guardamos en localStorage.
  const handleAction = (mode, projectId, projectFolio) => {
    if (mode === 'evaluador') {
      localStorage.setItem('selectedFolio', projectFolio);
    }
    setSelectedProjectId(projectId);
    setModalMode(mode);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProjectId(null);
    fetchData();
  };

  const columnHelper = createMRTColumnHelper();

  const columns = [
    columnHelper.accessor('folio', {
      header: 'Folio',
    }),
    columnHelper.accessor('fecha', {
      header: 'Fecha',
    }),
    // Se crea una columna que concatena nombre, apellido_paterno y apellido_materno
    columnHelper.accessor(
      row => `${row.nombre} ${row.apellido_paterno} ${row.apellido_materno}`,
      {
        header: 'Nombre Completo',
        id: 'nombreCompleto',
      }
    ),
    columnHelper.accessor('municipio', {
      header: 'Municipio',
    }),
    columnHelper.accessor('distrito_riego', {
      header: 'Distrito Riego',
    }),
    columnHelper.accessor('modulo_riego', {
      header: 'Modulo Riego',
    }),

    // {
    //   id: 'acciones',
    //   header: 'Acciones',
    //   enableSorting: false,
    //   enableColumnPinning: true,
    //   Cell: ({ row }) => {
    //     const { id, folio } = row.original;
    //     return (
    //       <Box display="flex" gap={1} className="Acciones-con">
    //         <Button
    //           variant="outlined"
    //           className="crud-button"
    //           // Se pasa el folio seleccionado junto con el id
    //           onClick={() => handleAction('evaluador', id, folio)}
    //         >
    //           Evaluar
    //         </Button>
    //         <Button
    //           variant="outlined"
    //           className="crud-button"
    //           onClick={() => window.open('/report', '_blank')}
    //         >
    //           Reporte
    //         </Button>
    //       </Box>
    //     );
    //   },
    //   enableSorting: false,
    // },
  ];

  // CSV Export config
  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    filename: 'acuerdos_export',
  });

  const estatusMap = {
    sin_avance: 'Sin Avance',
    en_proceso: 'En Proceso',
    atendido: 'Atendido',
    cancelado: 'Cancelado',
  };

  const sanitizeForCsv = (obj) => {
    const clean = {};
    for (const key in obj) {
      let value = obj[key];
      if (key === 'estatus') {
        value = estatusMap[value] || value;
      }
      if (key === 'descripcion_avance') {
        value = 'Ver todos los avances';
      }
      if (key === 'documentos') {
        if (Array.isArray(value)) {
          value = value.map((doc) =>
            typeof doc === 'string' ? doc : doc?.nombre || '[Documento]'
          ).join(', ');
        } else if (typeof value === 'object') {
          value = JSON.stringify(value);
        }
      }

      // Sanitización general
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        value === null ||
        value === undefined
      ) {
        clean[key] = value;
      } else {
        clean[key] = JSON.stringify(value);
      }
    }
    return clean;
  };

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => sanitizeForCsv(row.original));
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportAllData = () => {
    const cleanData = data.map(sanitizeForCsv);
    const csv = generateCsv(csvConfig)(cleanData);
    download(csvConfig)(csv);
  };

  const table = useMaterialReactTable({
    data,
    columns,
    enableRowSelection: true,
    enableColumnActions: false,
    enableColumnPinning: true,
    enableDensityToggle: false,
    enableColumnFilters: true,
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
    initialState: {
      columnVisibility: { id: false },
      columnPinning: { right: ['acciones'] },
    },
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
      noRecordsToDisplay: 'No se encontraron registros',
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
        styleOverrides: { root: { borderRadius: '40px' } },
      },
      MuiTypography: {
        styleOverrides: {
          h3: { fontWeight: 600, fontSize: '2.25rem', color: '#DEC9A3', fontFamily: 'Montserrat', padding: '10px' },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="table_grid">
        <Typography variant="h3">Patrón de Solicitantes</Typography>
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

export default TablePresidentes;
