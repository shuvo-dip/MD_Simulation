# LJ Fluid

In this hands-on guide, we'll use LAMMPS to simulate a mixture of two fluids (binary fluid) and study the phase separation. The fluids are modeled as Lennard-Jones particles confined within a cubic box with continuous boundaries (periodic boundary conditions).  We'll employ a Langevin thermostat to control the temperature, and calculate fundamental properties like potential and kinetic energies. This tutorial serves as a stepping stone, showcasing essential elements of molecular dynamics simulations, including setting up the system, minimizing energy, solving the equations of motion, and visualizing the resulting particle trajectories.

## Introduction to simple LAMMPS script

In order to go through step by step lets consider the simulation framework. Simulation might contains several files. But here we mainly focus on:
  - a) `run.in` -- it cpntains mostly all the informations
  - b) `system.data` -- particles, positions, velocities, bonds, angles, information

`````{admonition} run.in
:class: tip
- **1) Initialization:** units, dimension, atom_style, pair_style boundary _etc._
- **2a) System definition:** either load `system.data` or `create_atoms`
- **2b) Bond and Angle information:** `pair_coeff`, `angle_coeff`, `mass`
- **3) Minimization:** to avoid initial overlaps 
- **4) Visualization:** Check whether particles are in the box _etc._
- **5) Dummy Run:** Initially run for small timesteps _i.e.,_ $\sim 10^5$ 
- **6) Reset time:** `write_data` , `reset_timesteps`
- **7) Final Run:**
`````



`````{admonition} [system.data:]() an example of lammps generated system file
:class: tip
```
LAMMPS data file via write_data, version 3 Mar 2020, timestep = 0

200 atoms
5 atom types
199 bonds
1 bond types
198 angles
1 angle types

0.0000000000000000e+00 5.0000000000000000e+01 xlo xhi
0.0000000000000000e+00 5.0000000000000000e+01 ylo yhi
0.0000000000000000e+00 5.0000000000000000e+01 zlo zhi

Masses

1 1
2 1
3 1
4 1
5 1

Atoms # full

35 1 4 0.0000000000000000e+00 4.6927442356735957e-04 2.5917304644577136e+01 9.2446343214115345e-01 1 0 1
24 1 3 0.0000000000000000e+00 4.4738596798170382e+00 2.7817888523819551e+01 5.6717976560832186e+00 1 0 1
200 1 1 0.0000000000000000e+00 5.9147516604228179e-01 1.8162531643029414e+01 4.7691758446364831e+00 1 0 1
166 1 5 0.0000000000000000e+00 1.4206564943257913e-01 2.5387383075812657e+01 4.9959602477906309e+01 1 0 0
168 1 3 0.0000000000000000e+00 5.9831302455988533e-01 2.7059222183708062e+01 4.9375698118072819e+01 1 0 0
167 
.
.
.
198 1 3 0.0000000000000000e+00 4.9886372673067399e+01 1.9279039503505089e+01 3.3634226785821535e+00 0 0 1
188 1 3 0.0000000000000000e+00 4.9545910789376187e+01 2.5180567455466711e+01 4.8987638671791863e+01 0 0 0
89 1 2 0.0000000000000000e+00 4.9901224571757616e+01 1.5141601528783990e+01 4.6754960184097342e+01 0 0 0
114 1 3 0.0000000000000000e+00 4.9958704483647480e+01 2.1674563605430009e+01 1.3738041526491067e+01 0 0 1

Velocities

35 -8.7770147801311138e-01 1.5101693717367606e+00 6.0446096933556570e-01
24 -9.9424974102245878e-01 1.3375187903264580e+00 2.5207278347123672e+00
200 1.1303805073183029e+00 6.5838908974304966e-01 1.6455895349853347e+00
166 -2.1711562280283929e+00 5.5739576720902884e-01 -2.4101260924931348e-01
168 3.9698835008419225e-02 5.8955871401596471e-01 2.3171435957398314e+00
.
.
.
188 -1.8696257894080665e-01 -1.1207437904225968e+00 -3.9930018404493181e-03
89 2.9740209786705213e-01 7.0494417493173855e-01 7.4736174728733051e-01
114 -4.7738544094380891e-01 5.8646358115481168e-01 -1.3337631131086364e-01


Bonds

1 1 35 36 
2 1 24 25
3 1 166 167
4 1 168 169
5 1 167 168
.
.
198 1 89 90
199 1 114 115

Angles

1 1 34 35 36
2 1 23 24 25
3 1 165 166 167
4 1 167 168 169
.
.
```
`````


### What are these numbers mean?
`````{admonition} [system.data:]() an example of lammps generated system file
:class: tip
```
LAMMPS data file via write_data, version 3 Mar 2020, timestep = 0

200 atoms
5 atom types
199 bonds
1 bond types
198 angles
1 angle types

X_low X_high xlo xhi :box dimension along x
Y_low Y_high ylo yhi :box dimension along y
Z_low Z_high zlo zhi :box dimension along z

Masses

atom_type mass
1 1
2 1

Atoms # full

atom_ID molecular_ID atom_type charge x y z ix iy iz(image in the periodic boundary)  
1 1 1 0 2 3 4 0 0 0
2 1 2 0 3 5 1 0 0 0

Velocities

atom_ID vx vy vz
1 0.5 0.4 0.33

Bonds

ID Bond_type atom1 atom2 (atom1 atom2 are sequentially connected via a bond)
1 1 1 2
2 1 2 3

Angles

ID Angle_type atom1 atom2 atom3 (atom1 atom2 and atom3 are sequentially connected)
1 1 1 2 3
2 1 2 3 4
```

:::{important}
Please make sure you always keep the format fixed
No space between different segements might leads to syntax error
:::

`````



`````{admonition} [run.in:]() LAMMPS script for a 10-particle LJ fluid
:class: tip
```
units lj           
pair_style lj/cut 2.5  
atom_type lj     
variable boxlength equal 10.0

create box box  x 0 ${boxlength} y 0 ${boxlength} z 0 ${boxlength}


variable natoms equal 10

lattice fcc ${natoms} 1.0 {boxlength}

mass 1 1.0  
pair_coeff * * 1.0 1.0

velocity all set 0 0 0 1.0  


fix langevin all temp/langevin 1.0 0.1  # Set desired temperature (T) and damping time (tau_t)

# Run the simulation for 1000 steps
run 1000


thermo_style custom pe ke
thermo 100

dump mydump all atom every 100 xyz

`````
