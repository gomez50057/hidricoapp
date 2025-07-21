'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MaterialReactTable, useMaterialReactTable, createMRTColumnHelper, } from 'material-react-table';
import { createTheme, ThemeProvider, CssBaseline, Typography, Button, Box, } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import axios from 'axios';
import ProjectModal from '../ProjectModal';
import '../CRUDTable.css';

const CRUDTable = () => {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [modalMode, setModalMode] = useState('edit');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data.length > 0) {
      setLoading(false);
      return;
    }
    const timer = setTimeout(() => setLoading(false), 10000);
    return () => clearTimeout(timer);
  }, [data]);


  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get('/api/formularios/', {
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
    if (mode === 'evaluador' || mode === 'view') {
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
    columnHelper.accessor('resolucion', {
      header: 'Resolución',
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

    {
      id: 'acciones',
      header: 'Acciones',
      enableSorting: false,
      enableColumnPinning: true,
      Cell: ({ row }) => {
        const { id, folio, resolucion } = row.original;
        const userRole = localStorage.getItem('userRole');
        const canEvaluate = userRole === '2b';
        const canView = userRole === '2b' || userRole === 'visualizador';

        return (
          <Box display="flex" gap={1} className="Acciones-con">
            {canEvaluate && (
              resolucion === 'Registrada' ? (
                <Button
                  variant="outlined"
                  className="crud-button"
                  onClick={() => handleAction('evaluador', id, folio)}
                >
                  Evaluar
                </Button>
              ) : (
                <Tooltip title={`Ya revisado: ${resolucion}`}>
                  <CheckCircleIcon color="success" />
                </Tooltip>
              )
            )}

            {canView && (
              <Button
                variant="outlined"
                className="crud-button"
                onClick={() => handleAction('view', id, folio)}
              >
                Consultar
              </Button>
            )}
          </Box>
        );
      },
      enableSorting: false,
    },
  ];

  // CSV Export config
  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    filename: 'acuerdos_export',
  });

  const buildCsvRow = (row) => ({
    'Nombre del capturista': row.created_by || '',
    'Fecha de captura': row.fecha || '',
    'Folio de captura': row.folio || '',
    '1.1 Nombre': row.nombre || '',
    '1.2 Apellido Paterno': row.apellido_paterno || '',
    '1.3 Apellido Materno': row.apellido_materno || '',
    '1.4 CURP': row.curp || '',
    '1.5 Domicilio': row.domicilio || '',
    '1.6 Identificación oficial': row.identificacion || '',
    '1.7 No. Telefónico Celular': row.telefono || '',
    '2.1 Municipio': row.municipio || '',
    '2.2 Localidad': row.localidad || '',
    '2.3 Distrito de Riego': row.distrito_riego || '',
    '2.4 Módulo de Riego': row.modulo_riego || '',
    '2.5 Superficie de parcela (ha)': row.superficie_parcela || '',
    '2.6 No. cuenta CONAGUA': row.cuenta_conagua || '',
    '2.7 Tiempo promedio de riego (parcela)': row.tiempo_promedio_riego || '',
    '2.8 Latitud': row.latitud || '',
    '2.9 Longitud': row.longitud || '',
    '2.10 Grado de Pendiente': row.grado_pendiente || '',
    '2.11 Pedregosidad': row.pedregosidad || '',
    '2.12 Profundidad del suelo': row.profundidad_suelo || '',
    '2.13 Canaleta revestida': row.tipo_revestimiento || '',
    '2.14 Ancho de la canaleta de riego en cm (zanja)': row.tamano_canaleta_ancho || '',
    '2.15 Alto de la canaleta de riego en cm (zanja)': row.tamano_canaleta_alto || '',
    '2.16 Gasto en canales (lps)': row.gasto_canales || '',
    '2.17 Distancia de parcela a la canaleta revestida (m)': row.distancia_canaleta || '',
    '2.18 Tipo de sección de la canaleta': row.tipo_seccion || '',
    '2.19 ¿Ha realizado nivelación de tierra anteriormente?': row.ha_nivelado || '',
    '2.19.1 ¿En qué año?': row.anio_nivelacion || '',
    '2.20 ¿Su parcela presenta problemas de drenaje y/o salinidad?': row.problemas_drenaje || '',
    '2.21 Cultivos dominantes en la parcela': row.cultivos_dominantes || '',
    '2.22 ¿Cultivo actual?': row.cultivo_actual || '',
    '2.22.1 ¿Va a realizar trabajos de roturación (cambio del cultivo) en el presente año?': row.perene_roturacion || '',
    '2.22.1 ¿En qué fecha estaría libre la parcela?': row.fecha_libre_parcela || '',
    '2.23 ¿Acredita la legal posesión o propiedad de la tierra?': row.acreditacion_propiedad || '',
    '2.24 Documento que presenta': row.documento_presentado || '',
    '3.1 Certeza jurídica de la parcela': row.legal_propiedad_pdf || '',
    '3.2 Identificación oficial': row.identificacion_pdf || '',
    '3.3 Comprobante de domicilio': row.comprobante_domicilio_pdf || '',
    '3.4 Vale de riego reciente': row.vale_riego_reciente_pdf || '',
    '3.5 ¿Cuenta con curso de capacitación de SADER?': row.curso_sader || '',
    '3.5.1 Cargar constancia(solo PDF)': row.constancia_pdf || '',
    // 'Resolucion': row.resolucion || '',
    'Observaciones': row.observaciones || '',
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
    const rowData = rows.map((row) => buildCsvRow(row.original));
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportAllData = () => {
    const cleanData = data.map(buildCsvRow);
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
      noRecordsToDisplay: loading ? 'Cargando y buscando datos...' : 'No se encontraron registros',
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
        <Typography variant="h3">Padron de Solicitantes</Typography>
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

export default CRUDTable;
