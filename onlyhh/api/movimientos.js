import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async (event) => {
    if (event.httpMethod === 'POST') {
        const { socio, cantidad, tipo, concepto } = JSON.parse(event.body);
        
        // Validación para asegurarse de que el socio es válido
        if (!['Andy', 'Edgar', 'Emiliano', 'Felipe'].includes(socio)) {
            return { statusCode: 400, body: JSON.stringify({ error: "Socio no válido" }) };
        }

        // Inserta el movimiento con el concepto
        const { data, error } = await supabase.from('movimientos').insert([{
            socio, 
            cantidad, 
            tipo, 
            concepto
        }]);

        if (error) return { statusCode: 500, body: JSON.stringify(error) };

        return { statusCode: 200, body: JSON.stringify({ message: "Movimiento registrado" }) };
    }

    else if (event.httpMethod === 'GET') {
        const { data, error } = await supabase.from('movimientos').select('*');
        if (error) return { statusCode: 500, body: JSON.stringify(error) };

        const total = data.reduce((acc, m) => acc + (m.tipo === 'ingreso' ? m.cantidad : -m.cantidad), 0);
        return { statusCode: 200, body: JSON.stringify({ total, movimientos: data }) };
    }

    return { statusCode: 405, body: JSON.stringify({ error: "Método no permitido" }) };
};