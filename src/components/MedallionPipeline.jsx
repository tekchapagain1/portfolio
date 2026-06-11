export default function MedallionPipeline() {
  return (
    <div className="medallion">
      <div className="medallion-title">Data Pipeline</div>
      <div className="medallion-flow">
        <div className="medallion-stage medallion-stage--bronze">
          <div className="medallion-stage-header">
            <span className="medallion-dot" />
            Bronze
          </div>
          <div className="medallion-stage-items">
            <span className="medallion-item">Raw resume.json</span>
            <span className="medallion-item">Unstructured profile</span>
            <span className="medallion-item">Nested arrays</span>
          </div>
        </div>
        <div className="medallion-arrow">&#x25B6;</div>
        <div className="medallion-stage medallion-stage--silver">
          <div className="medallion-stage-header">
            <span className="medallion-dot" />
            Silver
          </div>
          <div className="medallion-stage-items">
            <span className="medallion-item">7 relational tables</span>
            <span className="medallion-item">Normalized schema</span>
            <span className="medallion-item">SQL queryable</span>
          </div>
        </div>
        <div className="medallion-arrow">&#x25B6;</div>
        <div className="medallion-stage medallion-stage--gold">
          <div className="medallion-stage-header">
            <span className="medallion-dot" />
            Gold
          </div>
          <div className="medallion-stage-items">
            <span className="medallion-item">Interactive portfolio</span>
            <span className="medallion-item">Query + Chat modes</span>
            <span className="medallion-item">Real-time insights</span>
          </div>
        </div>
      </div>
    </div>
  )
}
