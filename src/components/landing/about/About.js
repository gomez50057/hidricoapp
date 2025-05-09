"use client";

import React from 'react';
import Slider from './Slider';
import { ejesPlanEstatal } from '../../../utils/planEstal';
import styles from "../../../styles/Ejes.module.css";

export default function About() {
  return (
    <section className={styles.ejes}>
      <Slider items={ejesPlanEstatal} />
    </section>
  );
}