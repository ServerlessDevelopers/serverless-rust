import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Focus On What Matters',
    description: (
      <>
        Building applications with serverless technologies allows you, the developer, to focus 
        on the things that matter. Your application code.
      </>
    ),
  },
  {
    title: 'Scales As You Do',
    description: (
      <>
        You only pay for what you use, and serverless technologies scale as you do. So whether you're taking the
        first steps as a new startup or are an established organisation serverless can meet the demands of your users.
      </>
    ),
  },
  {
    title: 'Iterate Quickly',
    description: (
      <>
        Because serverless allows you to quickly deploy code, and you only pay for what you use, you can iterate
        and try new things quickly and at a low cost.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
