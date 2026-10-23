-- Starter categories (real structure, no fake products). Run after 001_schema.sql.
insert into public.categories (name, slug, sort_order) values
 ('Tiles','tiles',1),('Sanitary Ware','sanitary-ware',2),('Bathroom Fittings','bathroom-fittings',3),('Kitchen Products','kitchen-products',4),('Accessories & Other','accessories',5);

with p as (select id, slug from public.categories where parent_id is null)
insert into public.categories (name, slug, parent_id, sort_order)
select v.name, v.slug, p.id, v.ord from (values
 ('Floor Tiles','floor-tiles','tiles',1),('Wall Tiles','wall-tiles','tiles',2),('Porcelain Tiles','porcelain-tiles','tiles',3),
 ('Ceramic Tiles','ceramic-tiles','tiles',4),('Bathroom Tiles','bathroom-tiles','tiles',5),('Kitchen Tiles','kitchen-tiles','tiles',6),
 ('Wash Basins','wash-basins','sanitary-ware',1),('Toilets & Commodes','toilets-commodes','sanitary-ware',2),
 ('Showers & Faucets','showers-faucets','bathroom-fittings',1),('Kitchen Sinks','kitchen-sinks','kitchen-products',1)
) as v(name, slug, parent, ord) join p on p.slug = v.parent;
