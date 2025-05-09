"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import 'leaflet/dist/leaflet.css';
import './ProjectMap.css';
import './leafletComponents/Leaflet.BigImage.min.css';
import { Hgo_Info } from './Hgo';
import { escMediaSupPrivada } from './educacionHidalgo';

const ProjectMap = () => {
  const mapRef = useRef(null);
  const layersRef = useRef({}); // Almacena las capas agregadas
  const [L, setL] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [visibleLayers, setVisibleLayers] = useState({
    Hgo: true,
    escMediaSupPrivada: true,
  });
  const [selectedMunicipality, setSelectedMunicipality] = useState("");

  const toggleLayerVisibility = useCallback((layerKey) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  }, []);

  // Carga dinámica de Leaflet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet')
        .then((module) => setL(module.default))
        .catch((err) => console.error("Error al cargar Leaflet:", err));
    }
  }, []);

  const commonStyle = useCallback((fillColor, color, weight = 2) => ({
    fillColor,
    fillOpacity: 0.3,
    color,
    weight,
  }), []);

  const createPopupHgo = useCallback((feature) => {
    const popupHeader = `<div class='PopupT'><b>Hidalgo</b></div>`;
    const {
      NOM_MUN, POBMUN, POBFEM, POBMAS, Superficie,
      POB_ESTATA, PMDU, NOM_LINK_P, FECH,
      LINKPMDU, LINKPMD, FECHPMD, ATLAS, LINKATLAS, FECHATLAS,
    } = feature.properties;

    const poblacionMunicipal = POBMUN ? POBMUN.toLocaleString() : "No disponible";
    const poblacionFemenina = POBFEM ? POBFEM.toLocaleString() : "No disponible";
    const poblacionMasculina = POBMAS ? POBMAS.toLocaleString() : "No disponible";
    const superficieMunicipal = Superficie ? `${Superficie.toFixed(3)} km²` : "No disponible";
    const poblacionMetropolitana = POB_ESTATA ? POB_ESTATA.toLocaleString() : "No disponible";

    let content = popupHeader;
    content += `<b>Municipio:</b> ${NOM_MUN || "Desconocido"}<br>`;
    content += `<b>Población Municipal:</b> ${poblacionMunicipal}<br>`;
    content += `<b>Mujeres:</b> ${poblacionFemenina}<br>`;
    content += `<b>Hombres:</b> ${poblacionMasculina}<br>`;
    content += `<b>Superficie:</b> ${superficieMunicipal}<br>`;
    content += `<b>Población Metropolitana:</b> ${poblacionMetropolitana}<br>`;
    content += `<div class='PopupSubT'><b>Instrumentos de Planeación</b></div>`;
    content += PMDU !== "No existe"
      ? `<b>PMDU:</b> <a href='${LINKPMDU || "#"}' target='_blank'>${NOM_LINK_P || "Consultar"}</a> <b>(${FECH || "N/A"})</b>`
      : `<b>PMDU:</b> ${PMDU}`;
    content += `<br><b>PMD:</b> <a href='${LINKPMD || "#"}' target='_blank'>Consultar</a> <b>(${FECHPMD || "N/A"})</b>`;
    content += ATLAS !== "No existe"
      ? `<br><b>Atlas de Riesgos:</b> <a href='${LINKATLAS || "#"}' target='_blank'>Consultar</a> <b>(${FECHATLAS || "N/A"})</b>`
      : `<br><b>Atlas de Riesgos:</b> ${ATLAS}`;
    return content;
  }, []);

  const createPopupEducation = useCallback((feature) => {
    const { nom_estab, nom_loc, nom_mun, codigo_act, telefono, www } = feature.properties;
    let content = `<b>${nom_estab || "Escuela"}</b><br>`;
    if (nom_loc) content += `<b>Localidad:</b> ${nom_loc}<br>`;
    if (nom_mun) content += `<b>Municipio:</b> ${nom_mun}<br>`;
    if (codigo_act) content += `<b>Código Actividad:</b> ${codigo_act}<br>`;
    if (telefono) content += `<b>Teléfono:</b> ${telefono}<br>`;
    if (www && www !== "-999") content += `<b>Web:</b> <a href='${www}' target='_blank'>Ver sitio</a>`;
    return content;
  }, []);

  // Funciones para agregar capas y guardarlas en layersRef
  const addHgoZone = useCallback(() => {
    const layer = L.geoJSON(Hgo_Info, {
      pane: 'polygonPane',
      style: commonStyle('#DEC9A3', '#DEC9A3'),
      onEachFeature: (feature, layer) => {
        layer.bindPopup(createPopupHgo(feature));
      }
    }).addTo(mapRef.current);
    layersRef.current.Hgo = layer;
  }, [L, commonStyle, createPopupHgo]);

  const addEducationLayer = useCallback(() => {
    const layer = L.geoJSON(escMediaSupPrivada, {
      pane: 'pointsPane',
      pointToLayer: (feature, latlng) =>
        L.circleMarker(latlng, {
          radius: 6,
          fillColor: "#2E86AB",
          color: "#1B4F72",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        }),
      onEachFeature: (feature, layer) => {
        layer.bindPopup(createPopupEducation(feature));
      }
    }).addTo(mapRef.current);
    layersRef.current.escMediaSupPrivada = layer;
  }, [L, createPopupEducation]);

  const removeLayer = useCallback((layerKey) => {
    if (layersRef.current[layerKey] && mapRef.current) {
      mapRef.current.removeLayer(layersRef.current[layerKey]);
      delete layersRef.current[layerKey];
    }
  }, []);

  // Extraer lista de municipios únicos a partir de Hgo_Info y ordenarlos alfabéticamente
  const municipalities = useMemo(() => {
    if (!Hgo_Info || !Hgo_Info.features) return [];
    const set = new Set();
    Hgo_Info.features.forEach(feature => {
      if (feature.properties && feature.properties.NOM_MUN) {
        set.add(feature.properties.NOM_MUN);
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  // Función para centrar el mapa en el municipio seleccionado y resaltar la zona
  const goToMunicipality = useCallback((municipality) => {
    if (!municipality || !L || !mapRef.current) return;
    // Filtrar las features correspondientes al municipio
    const features = Hgo_Info.features.filter(
      feature => feature.properties && feature.properties.NOM_MUN === municipality
    );
    if (features.length === 0) return;

    // Crear un grupo temporal para centrar el mapa
    const group = L.featureGroup(features.map(f => L.geoJSON(f)));
    mapRef.current.fitBounds(group.getBounds(), { maxZoom: 12 });

    // Crear una capa de destacado con estilo especial
    const highlightStyle = {
      color: '#691B32',
      weight: 3,
      fillColor: '#691B32',
      fillOpacity: 0.4,
    };
    const highlightLayer = L.geoJSON(features, { style: highlightStyle }).addTo(mapRef.current);

    // Eliminar la capa de destacado después de unos segundos
    setTimeout(() => {
      mapRef.current.removeLayer(highlightLayer);
    }, 1500);
  }, [L]);

  // Inicializa el mapa, configura los panes y aplica parches al plugin de impresión
  useEffect(() => {
    if (!L) return;
    if (!mapRef.current) {
      // Inicializa el mapa una sola vez
      mapRef.current = L.map('map', {
        center: [20.44819465937593, -98.41534285830343],
        zoom: 9,
        zoomControl: false,
        attributionControl: false,
        minZoom: 8,
        maxZoom: 18,
      });
      L.tileLayer('http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }).addTo(mapRef.current);

      // Crear panes personalizados para controlar el orden de renderizado
      mapRef.current.createPane('polygonPane');
      mapRef.current.createPane('pointsPane');
      // Asignar z-index: puntos por encima de polígonos
      mapRef.current.getPane('polygonPane').style.zIndex = 200;
      mapRef.current.getPane('pointsPane').style.zIndex = 300;

      // Importar dinámicamente el plugin de impresión
      import('./leafletComponents/Leaflet.BigImage.min.js')
        .then(() => {
          // Parchar el plugin para incluir CircleMarker en la impresión
          const originalGetPathLayer = L.Control.BigImage.prototype._getPathLayer;
          L.Control.BigImage.prototype._getPathLayer = function (layer, callback) {
            if (layer instanceof L.CircleMarker) {
              const center = this._map.project(layer.getLatLng())
                .subtract(new L.Point(this.bounds.min.x, this.bounds.min.y));
              this.markers[layer._leaflet_id] = {
                isCircleMarker: true,
                x: center.x,
                y: center.y,
                radius: layer.getRadius(),
                fillColor: layer.options.fillColor,
                color: layer.options.color,
                weight: layer.options.weight,
                fillOpacity: layer.options.fillOpacity,
                opacity: layer.options.opacity
              };
              callback();
            } else {
              originalGetPathLayer.call(this, layer, callback);
            }
          };

          const originalDrawText = L.Control.BigImage.prototype._drawText;
          L.Control.BigImage.prototype._drawText = function (obj, x, y) {
            if (obj.isCircleMarker) {
              this.ctx.beginPath();
              this.ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
              this.ctx.fillStyle = obj.fillColor;
              this.ctx.globalAlpha = obj.fillOpacity;
              this.ctx.fill();
              this.ctx.lineWidth = obj.weight;
              this.ctx.strokeStyle = obj.color;
              this.ctx.globalAlpha = obj.opacity;
              this.ctx.stroke();
            } else {
              originalDrawText.call(this, obj, x, y);
            }
          };

          const bigImageControl = L.control.bigImage().addTo(mapRef.current);
          const originalPrint = bigImageControl._print;
          bigImageControl._print = function () {
            setTimeout(() => {
              originalPrint.call(this);
            }, 1000);
          };
        })
        .catch(err => console.error("Error al cargar el plugin de impresión:", err));
    }

    // Actualizar capas según el estado de visibleLayers
    if (visibleLayers.Hgo) {
      if (!layersRef.current.Hgo) addHgoZone();
    } else {
      removeLayer('Hgo');
    }

    if (visibleLayers.escMediaSupPrivada) {
      if (!layersRef.current.escMediaSupPrivada) addEducationLayer();
    } else {
      removeLayer('escMediaSupPrivada');
    }
  }, [L, visibleLayers, addHgoZone, addEducationLayer, removeLayer]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
    setTimeout(() => mapRef.current?.invalidateSize(), 300);
  }, []);

  const toggleFullScreen = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (!isFullScreen && mapRef.current) {
        mapRef.current.getContainer().requestFullscreen();
      } else if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      setIsFullScreen((prev) => !prev);
    }
  }, [isFullScreen]);

  return (
    <section className="mapaConte">
      <div id="map">
        <button
          id="toggleSidebar"
          onClick={toggleSidebar}
          className={isSidebarOpen ? 'open' : ''}
        >
          {isSidebarOpen ? 'Cerrar' : 'Abrir panel de información'}
        </button>

        <div id="fullscreenButton" onClick={toggleFullScreen}>
          {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </div>

        <div id="sidebar" className={isSidebarOpen ? 'open' : ''}>
          <p className="sidebar-title">Proyectos</p>

          <div className="municipio-dropdown">
            <label htmlFor="municipioSelect"><b>Ir a Municipio:</b></label>
            <input
              list="municipalities"
              id="municipioSelect"
              placeholder="Seleccione un Municipio..."
              value={selectedMunicipality}
              onChange={(e) => {
                setSelectedMunicipality(e.target.value);
                goToMunicipality(e.target.value);
              }}
            />
            <datalist id="municipalities">
              {municipalities.map(m => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </div>

          <div className="dropdown">
            <button
              className="dropdown-toggle"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Educación
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu glass-effect">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="checkboxHgo"
                    checked={visibleLayers.Hgo}
                    onChange={() => toggleLayerVisibility('Hgo')}
                  />
                  <label htmlFor="checkboxHgo">Hidalgo</label>
                </div>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="checkboxEdu"
                    checked={visibleLayers.escMediaSupPrivada}
                    onChange={() => toggleLayerVisibility('escMediaSupPrivada')}
                  />
                  <label htmlFor="checkboxEdu">
                    Educación Media Superior Privada (Hidalgo)
                  </label>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
      <div className="mapaTxt">
        <h2><span>Huella Hídrica</span> <span className="spanDoarado">Dónde Estamos</span></h2>
        <p>Descubre nuestro mapa interactivo, donde podrás visualizar de manera dinámica las zonas de mayor estrés hídrico y sobreexplotación de acuíferos, junto con la infraestructura hidráulica existente —presas, pozos, plantas de tratamiento y ríos— y los principales cuerpos de agua. Además, identifica las áreas impactadas por la contaminación y conoce en detalle la situación de los acuíferos.</p>
        <p>Esta herramienta te acerca a la realidad hídrica de nuestra región, mostrando datos clave para impulsar soluciones y un futuro sostenible.</p>

      </div>
    </section>
  );
};

export default ProjectMap;
