# Temperanzza Video Product Replacement

Pipeline experimental para substituir o pote existente em video pelo asset oficial Temperanzza sem regenerar o rotulo.

Primeiro SKU: Lemon Pepper 50 g.

Fluxo: extracao de frames, tracking/segmentacao do pote, remocao temporal, composicao do asset oficial, oclusao de maos e dedos, ajuste de perspectiva/luz/motion blur e recomposicao do audio.

O asset do produto e protegido: o pipeline nao deve redesenhar tipografia, logo, nome do SKU ou peso liquido.